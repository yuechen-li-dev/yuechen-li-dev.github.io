import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = await readFile(resolve(root, "src/aetheris/content.ts"), "utf8");
const routeSource = await readFile(
  resolve(root, "src/aetheris/routes.ts"),
  "utf8",
);
const capabilities = JSON.parse(
  await readFile(
    resolve(root, "src/aetheris/generated/preview1-capabilities.json"),
    "utf8",
  ),
);
const routeArraySource = routeSource.split("] as const")[0];
const routes = [
  ...new Set(
    [...routeArraySource.matchAll(/"(\/aetheris\/[^"\n]*|\/aetheris\/)"/g)].map(
      (match) => match[1],
    ),
  ),
];

const normalizerSource = await readFile(
  resolve(root, "src/aetheris/routes.ts"),
  "utf8",
);
if (!normalizerSource.includes('withoutIndex === "/aetheris/"')) {
  throw new Error(
    "The /aetheris/ landing route is not preserved by normalization.",
  );
}

if (capabilities.features.length < 10 || !capabilities.sourceSha256) {
  throw new Error("Preview 1 capability snapshot is incomplete.");
}
for (const route of routes) {
  if (!source.includes(`route: "${route}"`))
    throw new Error(`Route has no page: ${route}`);
}
for (const match of source.matchAll(/fixture:\s*"([^"]+)"/g)) {
  if (!match[1].startsWith("fixtures/") && !match[1].startsWith("demos/")) {
    throw new Error(`Non-canonical example source: ${match[1]}`);
  }
}
for (const match of source.matchAll(/href=\\?"(\/aetheris\/?[^"\\]*)/g)) {
  const linkedRoute = match[1].replace(/\/$/, "") || "/aetheris/";
  const normalizedRoutes = routes.map((route) =>
    route === "/aetheris/" ? route : route.replace(/\/$/, ""),
  );
  if (
    !normalizedRoutes.includes(
      linkedRoute === "/aetheris" ? "/aetheris/" : linkedRoute,
    )
  ) {
    throw new Error(`Internal link has no stable route: ${match[1]}`);
  }
}
for (const match of source.matchAll(/src:\s*"\/aetheris\/assets\/([^"]+)"/g)) {
  await access(resolve(root, "public/aetheris/assets", match[1]));
}
if (process.argv.includes("--dist")) {
  for (const route of routes) {
    const relative = route.replace(/^\//, "");
    await access(resolve(root, "dist", relative, "index.html"));
  }
  await access(resolve(root, "dist", "404.html"));
  const assets = await readdir(resolve(root, "dist", "assets"));
  if (assets.length === 0) throw new Error("Production build has no assets.");
}
console.log(
  `Validated ${routes.length} routes, capability snapshot, canonical fixture attribution, and${process.argv.includes("--dist") ? " production output" : " source structure"}.`,
);

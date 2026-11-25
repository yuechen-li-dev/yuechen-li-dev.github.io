import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const content = await readFile(
  resolve(root, "src/aetheris/content.ts"),
  "utf8",
);
const routeSource = await readFile(
  resolve(root, "src/aetheris/routes.ts"),
  "utf8",
);
const snapshot = JSON.parse(
  await readFile(
    resolve(root, "src/aetheris/generated/preview2-docs.json"),
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
const aliasSource = routeSource.split("ROUTE_ALIASES")[1] ?? "";
const aliases = new Set(
  [...aliasSource.matchAll(/"(\/aetheris\/[^"\n]*)":/g)].map(
    (match) => match[1],
  ),
);

if (!routeSource.includes('withoutIndex === "/aetheris/"'))
  throw new Error(
    "The /aetheris/ landing route is not preserved by normalization.",
  );
if (
  snapshot.languageFeatures.length < 30 ||
  snapshot.platformFeatures.length < 15
)
  throw new Error("Preview 2 feature snapshot is incomplete.");
for (const route of routes) {
  if (!aliases.has(route) && !content.includes(`"${route}"`))
    throw new Error(`Route has no page or alias: ${route}`);
}
for (const [key, fixture] of Object.entries(snapshot.fixtures)) {
  if (!fixture.path || !fixture.source)
    throw new Error(`Canonical fixture ${key} is incomplete.`);
}
for (const term of [
  "SemanticValue",
  "InlineStep",
  "SurfaceMeshIR",
  "ToleranceStackup",
  "Forge Host SDK",
  "Linear-elastic FEA",
]) {
  if (!content.includes(term))
    throw new Error(`Required Preview 2 topic is absent: ${term}`);
}
for (const match of content.matchAll(/src: "\/aetheris\/assets\/([^"]+)"/g))
  await access(resolve(root, "public/aetheris/assets", match[1]));
if (process.argv.includes("--dist")) {
  for (const route of routes)
    await access(resolve(root, "dist", route.replace(/^\//, ""), "index.html"));
  if ((await readdir(resolve(root, "dist/assets"))).length === 0)
    throw new Error("Production build has no assets.");
  const registry = JSON.parse(await readFile(resolve(root, "content/projects.json"), "utf8"));
  const portalRoutes = ["/", "/404.html"];
  for (const project of registry.projects) {
    if (project.renderer === "legacy") continue;
    portalRoutes.push("/" + project.slug + "/");
    for (const page of project.pages) {
      portalRoutes.push("/" + project.slug + "/" + page.slug + "/");
    }
  }
  const htmlFor = async (path) => readFile(resolve(root, "dist", path.slice(1)
    + (path.endsWith("/") ? "index.html" : "")), "utf8");
  for (const route of portalRoutes) {
    const html = await htmlFor(route);
    if (!/<main\b/.test(html) || !/<h1\b/.test(html) || /<script\b/i.test(html)) {
      throw new Error("Portal route should contain a readable static page: " + route);
    }
    if (route !== "/404.html" && !html.includes('rel="canonical" href="' + registry.origin + route + '"')) {
      throw new Error("Portal route has a missing or incorrect canonical URL: " + route);
    }
    for (const [, href] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const url = new URL(href, registry.origin + route);
      if (url.origin !== registry.origin) continue;
      const path = decodeURIComponent(url.pathname);
      const destination = resolve(root, "dist", path.slice(1) + (path.endsWith("/") ? "index.html" : ""));
      await access(destination).catch(() => {
        throw new Error("Missing internal link or asset " + href + " from " + route);
      });
      if (url.hash && portalRoutes.includes(path)) {
        const anchor = decodeURIComponent(url.hash.slice(1));
        const target = path === route ? html : await htmlFor(path);
        const ids = Array.from(target.matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
        if (!ids.includes(anchor)) throw new Error("Missing anchor " + href + " from " + route);
      }
    }
  }
  console.log("Validated " + portalRoutes.length + " static portal pages and their internal links and assets.");
}
console.log(
  `Validated ${routes.length} stable routes (${aliases.size} aliases), ${snapshot.languageFeatures.length + snapshot.platformFeatures.length} synchronized feature rows, ${Object.keys(snapshot.fixtures).length} canonical fixtures, and${process.argv.includes("--dist") ? " production output" : " source structure"}.`,
);

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const aetherisRoot = resolve(siteRoot, "..", "Aetheris");
const manifestPath = resolve(
  aetherisRoot,
  "artifacts/release/preview1-capabilities.json",
);
const outputPath = resolve(
  siteRoot,
  "src/aetheris/generated/preview1-capabilities.json",
);
const source = await readFile(manifestPath, "utf8");
const manifest = JSON.parse(source);
const docsSource = await readFile(
  resolve(siteRoot, "src/aetheris/content.ts"),
  "utf8",
);

const fixturePaths = new Set();
for (const feature of manifest.features ?? []) {
  for (const fixture of feature.fixturePaths ?? []) fixturePaths.add(fixture);
}
for (const fixture of manifest.invalidFixtures ?? [])
  fixturePaths.add(fixture.fixturePath);
for (const policy of manifest.edgeFinish?.invalidPolicies ?? [])
  fixturePaths.add(policy.fixturePath);
for (const match of docsSource.matchAll(
  /fixtures\/[A-Za-z0-9_./-]+\.(?:firmament|firmfixture)/g,
)) {
  fixturePaths.add(match[0]);
}

const missing = [];
for (const fixture of fixturePaths) {
  try {
    await readFile(resolve(aetherisRoot, fixture));
  } catch {
    missing.push(fixture);
  }
}
if (missing.length > 0)
  throw new Error(
    `Capability manifest references missing fixtures:\n${missing.join("\n")}`,
  );

const snapshot = {
  source: "Aetheris/artifacts/release/preview1-capabilities.json",
  sourceSha256: createHash("sha256").update(source).digest("hex"),
  syncedAt: manifest.generatedAt,
  version: manifest.version,
  commit: manifest.commit,
  language: manifest.language,
  features: manifest.features,
  edgeFinish: manifest.edgeFinish,
  pmi: manifest.pmi,
  step: manifest.step,
  verification: manifest.verification,
  invalidFixtures: manifest.invalidFixtures,
  releaseBlockers: manifest.releaseBlockers,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
const biome = spawnSync(
  process.execPath,
  [
    resolve(siteRoot, "node_modules/@biomejs/biome/bin/biome"),
    "format",
    "--write",
    outputPath,
  ],
  { cwd: siteRoot, encoding: "utf8" },
);
if (biome.status !== 0) {
  throw new Error(
    `Could not format the generated capability snapshot:\n${biome.stderr || biome.stdout}`,
  );
}
console.log(
  `Synced ${snapshot.features.length} capabilities and verified ${fixturePaths.size} fixtures.`,
);

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const aetherisRoot = resolve(siteRoot, "..", "Aetheris");
const outputPath = resolve(
  siteRoot,
  "src/aetheris/generated/preview2-docs.json",
);

const sources = {
  languageReference: "docs/firmament-v2/language-reference.md",
  quickstart: "docs/firmament-v2/quickstart.md",
  languageFeatures: "docs/firmament-v2/language-features.json",
  platformFeatures: "docs/preview2/feature-manifest.json",
};

const fixturePaths = {
  bareBox: "fixtures/FirmamentV2/Canonical/valid/bare-box.firmament",
  tableTemplate:
    "fixtures/FirmamentV2/Canonical/valid/table-template-concept-path-compose.firmament",
  bearingModule: "fixtures/AssemblyM0/bearing-module.firmament",
  bearingModuleFailing: "fixtures/AssemblyM0/bearing-module-failing.firmament",
  templateBlockPair: "fixtures/AssemblyM1/template-block-pair.firmament",
  plateWithHole: "docs/fea/artifacts/m5/plate-with-hole.firmament",
  inlineStep:
    "fixtures/FirmamentV2/Canonical/valid/inline-step-recognize-replace.firmament",
  hexBolt: "testdata/firmament/examples/hexbolt_template_m2.firmament",
  profileBracket:
    "fixtures/FirmamentV2/Canonical/valid/profile-compose-l-bracket-counterbore-pmi.firmament",
  forgeHost: "tools/Aetheris.Forge.M1Evidence/Program.cs",
  forgeExtension: "Aetheris.Forge.SampleExtension/SecretGeometryExtension.cs",
};

async function text(path) {
  return readFile(resolve(aetherisRoot, path), "utf8");
}

const languageReference = await text(sources.languageReference);
const quickstart = await text(sources.quickstart);
const languageFeaturesSource = await text(sources.languageFeatures);
const platformFeaturesSource = await text(sources.platformFeatures);
const languageFeatures = JSON.parse(languageFeaturesSource);
const platformFeatures = JSON.parse(platformFeaturesSource);
const fixtures = {};
for (const [key, path] of Object.entries(fixturePaths)) {
  fixtures[key] = { path, source: await text(path) };
}

const measurements = {
  ...JSON.parse(
    await text("docs/preview2/evidence/docsite-m2/measured-results.json"),
  ),
};

const hashes = {};
for (const [name, source] of Object.entries({
  languageReference,
  quickstart,
  languageFeaturesSource,
  platformFeaturesSource,
})) {
  hashes[name] = createHash("sha256").update(source).digest("hex");
}
for (const [name, fixture] of Object.entries(fixtures)) {
  hashes[`fixture:${name}`] = createHash("sha256")
    .update(fixture.source)
    .digest("hex");
}

const snapshot = {
  version: platformFeatures.version,
  generatedAt: platformFeatures.generatedAt,
  sources,
  hashes,
  languageReference,
  quickstart,
  languageFeatures: languageFeatures.features,
  platformFeatures: platformFeatures.features,
  fixtures,
  measurements,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
const format = spawnSync(
  process.execPath,
  [
    resolve(siteRoot, "node_modules/@biomejs/biome/bin/biome"),
    "format",
    "--write",
    outputPath,
  ],
  { cwd: siteRoot, encoding: "utf8" },
);
if (format.status !== 0) {
  throw new Error(
    `Could not format the generated Preview 2 snapshot:\n${format.stderr || format.stdout}`,
  );
}

const visualAssets = {
  "hexbolt-isometric.png":
    "docs/preview2/evidence/hexbolt-m1/generated-isometric.png",
  "hexbolt-surface-mesh.png":
    "docs/preview2/evidence/surface-mesh-ir-m7/ctc-faces-3-98-provenance.png",
};
const assetRoot = resolve(siteRoot, "public/aetheris/assets/preview2");
await mkdir(assetRoot, { recursive: true });
for (const [name, path] of Object.entries(visualAssets)) {
  await copyFile(resolve(aetherisRoot, path), resolve(assetRoot, name));
}

console.log(
  `Synced ${snapshot.languageFeatures.length} language features, ${snapshot.platformFeatures.length} platform features, ${Object.keys(fixtures).length} compile fixtures, and ${Object.keys(visualAssets).length} measured visuals.`,
);

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Table } from "machinalayout/table";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("Preview 2 canonical data has implementation-grounded coverage", async () => {
  const data = JSON.parse(
    await read("src/aetheris/generated/preview2-docs.json"),
  );
  assert.equal(data.version, "Preview 2 Assembly M2");
  assert.ok(
    data.languageFeatures.some(
      (feature) =>
        feature.name === "SemanticValue" && feature.status === "Supported",
    ),
  );
  assert.ok(
    data.languageFeatures.some(
      (feature) => feature.name === "Assert ToleranceStackup",
    ),
  );
  assert.ok(
    data.platformFeatures.some(
      (feature) =>
        feature.id === "surface-mesh-ir" && feature.status === "Bounded",
    ),
  );
  assert.match(
    data.fixtures.bearingModule.source,
    /Assert ToleranceStackup AxialReach/,
  );
  assert.match(data.fixtures.plateWithHole.source, /analysis/i);
  assert.match(data.fixtures.inlineStep.source, /Recognize/);
  const featureTable = Table.fromObjects({
    id: "preview2-test-features",
    rows: data.languageFeatures.map((feature) => ({
      feature: feature.name,
      status: feature.status,
      evidence: feature.evidence.join(", "),
    })),
  });
  assert.deepEqual(Table.validate(featureTable), []);
  assert.equal(Table.rowCount(featureTable), data.languageFeatures.length);
});

test("navigation exposes the major Preview 2 systems and retains aliases", async () => {
  const routes = await read("src/aetheris/routes.ts");
  for (const route of [
    "/aetheris/forge/host-sdk",
    "/aetheris/analysis/fea",
    "/aetheris/assemblies/interfaces-mates",
    "/aetheris/geometry/surface-mesh-ir",
    "/aetheris/reference/features",
  ])
    assert.ok(routes.includes(route));
  assert.match(
    routes,
    /"\/aetheris\/existing-step": "\/aetheris\/firmament\/inline-step"/,
  );
});

test("pages cross-link source, outputs, reference, and examples", async () => {
  const content = await read("src/aetheris/content.ts");
  for (const heading of [
    "Definitive Firmament V2 language reference",
    "SemanticValue: one contract across origins",
    "Automatic worst-case tolerance stackup",
    "Showcase: plate with a circular hole",
  ])
    assert.ok(content.includes(heading));
  assert.match(content, /fixture: generated\.fixtures\[source\]\.path/);
});

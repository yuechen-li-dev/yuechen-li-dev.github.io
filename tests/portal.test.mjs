import assert from "node:assert/strict";
import { test } from "node:test";

const { Route, ValidateRoutes } = await import("../docs-compiler/dist/src/Portal.node.js");
const { Content, PlanPages, RenderArticle, RenderDirectories } = await import("../docs-compiler/dist/src/Site.node.js");

function checked(result) {
  assert.equal(result.tag, "ok", result.error);
  return result.value;
}

test("typed routes reject casing, traversal, reserved characters, and duplicates", () => {
  assert.equal(checked(Route("copeland-ts", "installation")), "/copeland-ts/installation/");
  for (const invalid of ["Aetheris", "../safe", "ffi/abc", "x%2Fy", "x--y", "oct-"]) {
    assert.equal(Route(invalid, "").tag, "err");
    assert.equal(Route("oct", invalid).tag, "err");
  }
  assert.equal(ValidateRoutes(["/oct/", "/oct/"]).tag, "err");
});

test("native TSX emits typed document events and static articles", () => {
  const pages = checked(PlanPages());
  assert.deepEqual(pages.map((page) => page.route), [
    "/copeland-ts/installation/", "/copeland-ts/writing-docs/", "/oct/cli/",
  ]);
  const author = pages[1];
  const events = Content(author.page.id);
  assert.ok(Object.isFrozen(events));
  assert.ok(events.some((event) => event.tag === "Open" && event.payload.node.tag === "Callout"));
  const outputs = pages.map((plan) => checked(RenderArticle(plan, Content(plan.page.id))));
  const html = outputs[1].content;
  assert.match(html, /<strong>Copeland TSX<\/strong>/);
  assert.match(html, /aria-label="On this page"/);
  assert.match(html, /href="#write-a-page"/);
  assert.match(html, /aria-current="page" href="\/copeland-ts\/writing-docs\/"/);
  assert.match(html, /data-language="tsx">export function QuickStart/);
  assert.match(html, /&lt;Document&gt;/);
  assert.match(outputs[0].content, /--add-source &lt;feed&gt;/);
  assert.match(outputs[2].content, /oct &lt;command&gt;/);
  for (const anchor of [
    "oct-atlas", "oct-make-and-makeoctest", "oct-make-reporting", "oct-artifact-build-phase",
    "oct-new-package-scaffolding", "oct-init-existing-package-manifests", "oct-json-infer",
    "oct-templates-discovery", "oct-pkg-wrapper-tooling", "optional-package-lockfiles",
    "version-surface", "package-manager--canonical-registry-quick-reference",
  ]) {
    assert.ok(outputs[2].content.includes(`id="${anchor}"`), `Missing published Oct CLI anchor ${anchor}`);
  }
  assert.doesNotMatch(html, /<script\b/);
  assert.deepEqual(outputs[1], checked(RenderArticle(author, events)));
});

test("framework emits a reusable theme and retains the legacy Aetheris entry", () => {
  const files = checked(RenderDirectories());
  assert.match(files.find((file) => file.path === "/").content, /href="\/aetheris\/"/);
  assert.match(files.find((file) => file.path === "/_docs/site.css").content, /\.docs-layout/);
});

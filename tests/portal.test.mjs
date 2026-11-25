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
  assert.deepEqual(pages.filter((page) => !page.route.startsWith("/copeland-ts/book/")).map((page) => page.route), [
    "/copeland-ts/installation/", "/copeland-ts/writing-docs/", "/oct/cli/",
  ]);
  const author = pages.find((plan) => plan.route === "/copeland-ts/writing-docs/");
  const events = Content(author.page.id);
  assert.ok(Object.isFrozen(events));
  assert.ok(events.some((event) => event.tag === "Open" && event.payload.node.tag === "Callout"));
  const outputs = new Map(pages.map((plan) => [plan.route, checked(RenderArticle(plan, Content(plan.page.id)))]));
  const html = outputs.get(author.route).content;
  assert.match(html, /<strong>Copeland TSX<\/strong>/);
  assert.match(html, /aria-label="On this page"/);
  assert.match(html, /href="#write-a-page"/);
  assert.match(html, /aria-current="page" href="\/copeland-ts\/writing-docs\/"/);
  assert.match(html, /data-language="tsx">export function QuickStart/);
  assert.match(html, /&lt;Document&gt;/);
  assert.match(outputs.get("/copeland-ts/installation/").content, /--add-source &lt;feed&gt;/);
  const oct = outputs.get("/oct/cli/").content;
  assert.match(oct, /oct &lt;command&gt;/);
  for (const anchor of [
    "oct-atlas", "oct-make-and-makeoctest", "oct-make-reporting", "oct-artifact-build-phase",
    "oct-new-package-scaffolding", "oct-init-existing-package-manifests", "oct-json-infer",
    "oct-templates-discovery", "oct-pkg-wrapper-tooling", "optional-package-lockfiles",
    "version-surface", "package-manager--canonical-registry-quick-reference",
  ]) {
    assert.ok(oct.includes(`id="${anchor}"`), `Missing published Oct CLI anchor ${anchor}`);
  }
  assert.doesNotMatch(html, /<script\b/);
  assert.deepEqual(outputs.get(author.route), checked(RenderArticle(author, events)));
});

test("the project placeholder links to a book with ordered chapter navigation", () => {
  const pages = checked(PlanPages());
  const bookRoutes = [
    "/copeland-ts/book/",
    "/copeland-ts/book/first-program/",
    "/copeland-ts/book/values-and-functions/",
    "/copeland-ts/book/records-and-collections/",
    "/copeland-ts/book/enums-and-match/",
    "/copeland-ts/book/absence-and-failure/",
    "/copeland-ts/book/modules-and-testing/",
    "/copeland-ts/book/model-ui-state/",
    "/copeland-ts/book/reduce-ui-events/",
    "/copeland-ts/book/stale-ui-responses/",
    "/copeland-ts/book/async-estimates/",
    "/copeland-ts/book/batch-estimates/",
  ];
  const chapters = pages.filter((plan) => plan.route.startsWith("/copeland-ts/book/"));
  assert.deepEqual(chapters.map((plan) => plan.route), bookRoutes);
  for (const chapter of chapters) {
    assert.deepEqual(chapter.navigation.map((link) => link.url), bookRoutes);
    const article = checked(RenderArticle(chapter, Content(chapter.page.id)));
    assert.ok(article.content.includes(`aria-current="page" href="${chapter.route}"`));
    assert.doesNotMatch(article.content, /<script\b/);
  }

  const front = checked(RenderDirectories()).find((file) => file.path === "/copeland-ts/");
  assert.match(front.content, /Project homepage in progress/);
  assert.match(front.content, /href="\/copeland-ts\/book\/">The Copeland TS Book</);
  assert.doesNotMatch(front.content, /href="\/copeland-ts\/book\/first-program\//);
});

test("framework emits the typed theme and preserves responsive and focus rules", () => {
  const files = checked(RenderDirectories());
  assert.match(files.find((file) => file.path === "/").content, /href="\/aetheris\/"/);
  const css = files.find((file) => file.path === "/_docs/site.css").content;
  assert.match(css, /^:root \{\n/);
  assert.doesNotMatch(css, /\\n/);
  assert.match(css, /a:focus-visible \{\s*outline: 2px solid rgb\(37, 123, 172\)/);
  assert.match(css, /\.skip:focus \{\s*top: 0\.75rem;/);
  assert.match(css, /\.docs-layout nav a\[aria-current="page"\] \{\s*font-weight: 650;/);
  assert.match(css, /\.docs-layout \{\s*display: grid;\s*grid-template-columns: 12rem minmax\(0, 1fr\) 12rem;/);
  assert.match(css, /@media \(max-width: 63rem\) \{\s*\.docs-layout \{\s*grid-template-columns: 11rem minmax\(0, 1fr\);/);
  assert.match(css, /@media \(max-width: 44rem\) \{\s*\.docs-layout \{\s*grid-template-columns: minmax\(0, 1fr\);/);
  assert.ok(css.indexOf("63rem)") < css.indexOf("44rem)"));
  assert.equal(checked(RenderDirectories()).find((file) => file.path === "/_docs/site.css").content, css);
});

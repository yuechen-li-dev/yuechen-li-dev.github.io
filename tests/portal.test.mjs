import assert from "node:assert/strict";
import { test } from "node:test";

const { Escape, Route, ValidateRoutes } = await import("../docs-compiler/dist/src/Portal.node.js");
const { HighlightCode } = await import("../docs-compiler/dist/src/Highlight.node.js");
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
  assert.match(html, /data-language="tsx"><span class="syntax-keyword">export<\/span>/);
  assert.match(html.replaceAll(/<\/?span[^>]*>/g, ""), /&lt;Document&gt;/);
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

test("the static highlighter preserves and escapes the original snippet", () => {
  const source = [
    "/* multi-line comment",
    "   with <script> & literal markup */",
    String.raw`const url: string = "https://example.test/\"q\""; // URL comment`,
    'const number = 0x2f + 1e-3 + .5;',
    'const label = `fixture ${number}`;',
    "const result = match ready { Ready => true, };",
    "",
  ].join("\n");
  const html = HighlightCode(source, "copeland:Tasks.ts");
  assert.equal(html.replaceAll(/<\/?span[^>]*>/g, ""), Escape(source));
  assert.match(html, /class="syntax-comment">\/\* multi-line comment\n   with &lt;script&gt; &amp; literal markup \*\/<\/span>/);
  assert.ok(html.includes(String.raw`<span class="syntax-string">&quot;https://example.test/\&quot;q\&quot;&quot;</span>`));
  assert.match(html, /class="syntax-comment">\/\/ URL comment<\/span>/);
  assert.match(html, /class="syntax-type">string<\/span>/);
  assert.match(html, /class="syntax-literal">0x2f<\/span> \+ <span class="syntax-literal">1e-3<\/span> \+ <span class="syntax-literal">\.5<\/span>/);
  assert.match(html, /class="syntax-keyword">match<\/span>/);
  assert.doesNotMatch(html, /<script>/);
  assert.doesNotMatch(HighlightCode(source, "typescript"), /class="syntax-keyword">match<\/span>/);
  assert.equal(HighlightCode(source, "output"), Escape(source));
});

test("the project placeholder links to a book with ordered chapter navigation", () => {
  const pages = checked(PlanPages());
  const base = "/copeland-ts/book/";
  const sections = [
    ["", [""]],
    ["Getting started", ["editor-setup", "first-program"]],
    ["Copeland TS basics", ["values-and-functions", "records-and-collections", "enums-and-match", "absence-and-failure", "modules-and-testing"]],
    ["Build a UI", ["first-view", "model-ui-state", "reduce-ui-events", "wire-ui-events", "layout-and-styling", "reusable-components", "forms-and-accessibility"]],
    ["Concurrency", ["async-estimates", "stale-ui-responses", "batch-estimates"]],
    ["Ship the UI", ["test-your-ui", "publish-your-ui"]],
    ["Metaprogramming", ["types-and-interfaces", "generics-and-templates", "static-evaluation"]],
    ["Packages and interoperability", ["npm-packages", "nuget-packages", "package-targets"]],
  ];
  const route = (slug) => slug ? base + slug + "/" : base;
  const bookRoutes = sections.flatMap(([, slugs]) => slugs.map(route));
  const chapters = pages.filter((plan) => plan.route.startsWith(base));
  assert.deepEqual(chapters.map((plan) => plan.route), bookRoutes);
  const index = chapters[0];
  const indexHtml = checked(RenderArticle(index, Content(index.page.id))).content;
  const indexArticle = indexHtml.split("<article>")[1].split("</article>")[0];
  const contents = indexArticle.slice(indexArticle.indexOf("<h2"));
  assert.deepEqual(
    Array.from(contents.matchAll(/href="(\/copeland-ts\/book\/[^"]+)"/g), ([, url]) => url),
    bookRoutes.slice(1),
  );
  const planned = [
    "editor-setup", "first-view", "wire-ui-events", "layout-and-styling", "reusable-components",
    "forms-and-accessibility", "test-your-ui", "publish-your-ui",
  ].map(route);
  assert.equal(Array.from(contents.matchAll(/Planned chapter\./g)).length, planned.length);
  for (const chapter of chapters) {
    assert.deepEqual(chapter.navigation.map((group) => [group.title, group.links.map((link) => link.url)]),
      sections.map(([title, slugs]) => [title, slugs.map(route)]));
    const { content } = checked(RenderArticle(chapter, Content(chapter.page.id)));
    assert.ok(content.includes(`aria-current="page" href="${chapter.route}"`));
    assert.doesNotMatch(content, /<script\b/);
    if (chapter.page.part) {
      assert.ok(content.includes(`<details open><summary>${chapter.page.part}</summary>`));
    }
    if (planned.includes(chapter.route)) {
      assert.match(content, /This chapter is planned\./);
      assert.match(content, /id="what-this-chapter-will-cover"/);
      assert.doesNotMatch(content, /<pre>/);
    }
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
  assert.match(css, /color-scheme: light dark;/);
  assert.match(css, /\.syntax-keyword \{\s*color: rgb\(111, 43, 147\)/);
  const dark = css.split("@media (prefers-color-scheme: dark) {")[1];
  assert.ok(dark);
  assert.match(dark, /:root \{\s*color: rgb\(221, 231, 243\);\s*background: rgb\(16, 23, 33\);/);
  assert.match(dark, /article pre \{\s*background: rgb\(24, 33, 47\);/);
  assert.match(dark, /\.syntax-keyword \{\s*color: rgb\(221, 172, 255\)/);
  assert.match(css, /\.skip:focus \{\s*top: 0\.75rem;/);
  assert.match(css, /\.docs-layout nav a\[aria-current="page"\] \{\s*font-weight: 650;/);
  assert.match(css, /\.docs-layout \{\s*display: grid;\s*grid-template-columns: 12rem minmax\(0, 1fr\) 12rem;/);
  assert.match(css, /@media \(max-width: 63rem\) \{\s*\.docs-layout \{\s*grid-template-columns: 11rem minmax\(0, 1fr\);/);
  assert.match(css, /@media \(max-width: 44rem\) \{\s*\.docs-layout \{\s*grid-template-columns: minmax\(0, 1fr\);/);
  assert.ok(css.indexOf("63rem)") < css.indexOf("44rem)"));
  assert.equal(checked(RenderDirectories()).find((file) => file.path === "/_docs/site.css").content, css);
});

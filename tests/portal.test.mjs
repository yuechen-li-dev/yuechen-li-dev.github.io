import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { renderMarkdown, renderPortal } from "../scripts/portal.mjs";

const registry = JSON.parse(await readFile(new URL("../content/projects.json", import.meta.url), "utf8"));
const engine = await import("../docs-compiler/dist/src/Portal.node.js");

test("typed routes reject casing, traversal, reserved characters, and duplicates", () => {
  assert.deepEqual(engine.Route("copeland-ts", "installation"), {
    tag: "ok", value: "/copeland-ts/installation/",
  });
  for (const invalid of ["Aetheris", "../safe", "ffi/abc", "x%2Fy", "x--y", "oct-"]) {
    assert.equal(engine.Route(invalid, "").tag, "err");
    assert.equal(engine.Route("oct", invalid).tag, "err");
  }
  assert.equal(engine.ValidateRoutes(["/oct/", "/oct/"]).tag, "err");
});

test("Markdown preserves headings, filters HTML and resolves published source links", () => {
  const source = registry.projects[1].source;
  const path = registry.projects[1].pages[0].file;
  const published = new Map([[source.repository + "@" + source.revision + ":" + path, "/copeland-ts/installation/"]]);
  const html = renderMarkdown(
    "# Install\n\n## Commands\n\n[Jump](installation.md#commands)\n\n## Commands\n\n<script>alert(1)</script>\n",
    source, path, published,
  );
  assert.match(html, /id="commands"/);
  assert.match(html, /id="commands-1"/);
  assert.match(html, /href="\/copeland-ts\/installation\/#commands"/);
  assert.doesNotMatch(html, /<(?:h1|script)\b/);
});

test("project registration drives deterministic pages with provenance", async () => {
  const load = async () => "# Original title\n\n## Usage\n\nSample instructions.";
  const pages = await renderPortal(engine, registry, load);
  assert.deepEqual(pages, await renderPortal(engine, registry, load));
  assert.deepEqual([...pages.keys()], [
    "/", "/404.html", "/copeland-ts/", "/copeland-ts/installation/", "/oct/", "/oct/cli/",
  ]);
  assert.match(pages.get("/"), /href="\/aetheris\/"/);
  const oct = pages.get("/oct/cli/");
  assert.match(oct, /<h1>CLI quick reference<\/h1>/);
  assert.match(oct, /Sample instructions/);
  assert.match(oct, /github\.com\/yuechen-li-dev\/oct\/blob\/da8b97236b6eeb8bbd72c84b254e988a31eb19a6\/docs\/CLI\.md/);
  assert.doesNotMatch(oct, /<script\b/);
  await assert.rejects(renderPortal(engine, {
    ...registry, projects: [...registry.projects, registry.projects[1]],
  }, load), /Duplicate page route/);
});

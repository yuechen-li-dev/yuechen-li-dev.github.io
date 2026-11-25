import MarkdownIt from "markdown-it";

function checked(result) {
  if (result.tag === "err") throw new Error(result.error);
  return result.value;
}

function sourceKey(source, file) {
  return source.repository + "@" + source.revision + ":" + file;
}

function sourceUrl(host, source, file, fragment = "") {
  const path = file.split("/").map(encodeURIComponent).join("/");
  const base = host === "raw"
    ? "https://raw.githubusercontent.com/" + source.repository + "/"
    : "https://github.com/" + source.repository + "/blob/";
  return base + source.revision + "/" + path + fragment;
}

function headingSlug(text) {
  return text.toLowerCase().trim().replace(/[^\p{Letter}\p{Number}\s_-]/gu, "")
    .replace(/\s/g, "-") || "section";
}

export function renderMarkdown(text, source, file, published) {
  const parser = new MarkdownIt({ html: false });
  const environment = {};
  const tokens = parser.parse(text, environment);
  if (tokens[0]?.tag === "h1" && tokens[0].type === "heading_open") {
    tokens.splice(0, 3);
  }
  const headings = new Set(["content"]);
  for (const [index, token] of tokens.entries()) {
    if (token.type === "heading_open") {
      const label = tokens[index + 1].children
        .filter((child) => child.type === "text" || child.type === "code_inline")
        .map((child) => child.content).join("");
      const base = headingSlug(label);
      let slug = base;
      for (let suffix = 1; headings.has(slug); suffix += 1) {
        slug = base + "-" + suffix;
      }
      headings.add(slug);
      token.attrSet("id", slug);
    }
    for (const child of token.children ?? []) {
      const image = child.type === "image";
      if (child.type !== "link_open" && !image) continue;
      const attribute = image ? "src" : "href";
      const target = child.attrGet(attribute);
      if (!target || target.startsWith("#") || /^([a-z]+:|\/\/)/i.test(target)) continue;
      const url = new URL(target, new URL(file, "https://source.invalid/"));
      const path = decodeURIComponent(url.pathname.slice(1));
      const route = published.get(sourceKey(source, path));
      child.attrSet(attribute, route && !image
        ? route + url.hash
        : sourceUrl(image ? "raw" : "github", source, path, url.hash));
    }
  }
  return parser.renderer.render(tokens, parser.options, environment);
}

async function readMarkdown(source, file) {
  const url = sourceUrl("raw", source, file);
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error("Documentation source returned HTTP " + response.status + " for " + url);
  return response.text();
}

export async function renderPortal(engine, registry, load = readMarkdown) {
  const origin = new URL(registry.origin);
  if (origin.protocol !== "https:" || origin.origin !== registry.origin) {
    throw new Error("The site origin must be a canonical HTTPS origin.");
  }
  const docs = registry.projects.map((project) => {
    const route = checked(engine.Route(project.slug, ""));
    if (project.renderer === "legacy") return { ...project, route, pages: [] };
    if (project.renderer !== "markdown" || !project.pages?.length
      || !/^[\w.-]+\/[\w.-]+$/.test(project.source?.repository)
      || !/^[a-f0-9]{40}$/.test(project.source?.revision)) {
      throw new Error("Invalid Markdown collection: " + project.slug);
    }
    const pages = project.pages.map((page) => {
      if (!page.slug || !page.file.endsWith(".md") || page.file.includes("\\")
        || page.file.split("/").some((part) => !part || part === "." || part === "..")) {
        throw new Error("Invalid page source in " + project.slug);
      }
      return { ...page, route: checked(engine.Route(project.slug, page.slug)) };
    });
    return { ...project, route, pages };
  });
  checked(engine.ValidateRoutes(docs.flatMap((project) => [
    project.route, ...project.pages.map((page) => page.route),
  ])));
  const published = new Map();
  for (const project of docs) {
    for (const page of project.pages) {
      const key = sourceKey(project.source, page.file);
      if (published.has(key)) throw new Error("Duplicate published source: " + key);
      published.set(key, page.route);
    }
  }
  const output = new Map();
  const projects = docs.map(({ title, route, summary }) => ({ title, url: route, summary }));
  output.set("/", engine.RenderIndex("Project documentation",
    "Browse the manuals and reference guides for each engineering project.", projects, origin.href));
  output.set("/404.html", engine.RenderNotFound());
  for (const project of docs) {
    if (project.renderer === "legacy") continue;
    const navigation = project.pages.map(({ title, route }) => ({ title, url: route }));
    // Render project summaries through the compiler instead of accepting authored HTML.
    output.set(project.route, engine.RenderIndex(project.title, project.summary, navigation.map((link, index) => ({
      ...link, summary: project.pages[index].summary,
    })), origin.origin + project.route));
    for (const page of project.pages) {
      const markdown = await load(project.source, page.file);
      const article = renderMarkdown(markdown, project.source, page.file, published);
      output.set(page.route, engine.RenderPage(page.title, page.summary,
        origin.origin + page.route, project.title,
        [{ title: project.title, url: project.route }, ...navigation], article,
        sourceUrl("github", project.source, page.file)));
    }
  }
  return output;
}

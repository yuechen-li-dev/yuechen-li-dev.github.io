import { matchKind } from "machinalayout/match";
import { Table } from "machinalayout/table";
import { Fragment, type ReactNode, useEffect, useMemo, useState } from "react";
import { FirmamentCode } from "./FirmamentCode";
import { DOC_PAGES, NAV_GROUPS } from "./content";
import generated from "./generated/preview2-docs.json";
import { normalizeRoute } from "./routes";
import type { DocBlock, DocPage } from "./types";

const sourceRoot = "https://github.com/yuechen-li-dev/Aetheris/blob/master/";

function keyedOccurrences(values: readonly string[]) {
  const counts = new Map<string, number>();
  return values.map((value) => {
    const occurrence = counts.get(value) ?? 0;
    counts.set(value, occurrence + 1);
    return { value, key: `${value}-${occurrence}` };
  });
}

function Matrix({ headers, rows }: Extract<DocBlock, { kind: "matrix" }>) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, index) => (
                <td key={`${index}-${cell}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function normalizeStatus(status: string) {
  if (status.startsWith("Future")) return "Unsupported";
  if (status === "Deprecated") return "Legacy";
  return status;
}

function docsRoute(name: string) {
  const value = name.toLowerCase();
  if (value.includes("fea")) return "/aetheris/analysis/fea";
  if (
    value.includes("assembly") ||
    value.includes("interface") ||
    value.includes("mate") ||
    value.includes("relation")
  )
    return "/aetheris/assemblies/interfaces-mates";
  if (value.includes("forge")) return "/aetheris/forge/host-sdk";
  if (value.includes("mesh")) return "/aetheris/geometry/surface-mesh-ir";
  if (value.includes("continuum")) return "/aetheris/analysis/continuum";
  if (value.includes("inline")) return "/aetheris/firmament/inline-step";
  if (value.includes("semantic")) return "/aetheris/firmament/semantics";
  if (value.includes("point") || value.includes("dimension"))
    return "/aetheris/firmament/datums-dimensions";
  if (
    value.includes("record") ||
    value.includes("template") ||
    value.includes("table")
  )
    return "/aetheris/firmament/records-tables-templates";
  return "/aetheris/reference/language";
}

function FeatureExplorer() {
  const rows = useMemo(
    () => [
      ...generated.languageFeatures.map((feature) => ({
        feature: feature.name,
        status: normalizeStatus(feature.status),
        category: "Language",
        summary: feature.produces,
        evidence: feature.evidence.join(", "),
      })),
      ...generated.platformFeatures.map((feature) => ({
        feature: feature.id,
        status: normalizeStatus(feature.status),
        category: "Platform",
        summary: feature.reason,
        evidence: "Preview 2 feature manifest",
      })),
    ],
    [],
  );
  const table = useMemo(
    () => Table.fromObjects({ id: "aetheris-preview2-features", rows }),
    [rows],
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return Table.toObjects(
      Table.filter(
        table,
        (row) =>
          (status === "All" || row.status === status) &&
          (!needle ||
            Object.values(row).join(" ").toLowerCase().includes(needle)),
      ),
    );
  }, [query, status, table]);
  return (
    <section
      className="feature-explorer"
      aria-labelledby="feature-explorer-title"
    >
      <div className="explorer-controls">
        <label>
          <span id="feature-explorer-title">Filter features</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Template, FEA, imported STEP…"
          />
        </label>
        <label>
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All</option>
            <option>Supported</option>
            <option>Bounded</option>
            <option>Experimental</option>
            <option>Legacy</option>
            <option>Unsupported</option>
          </select>
        </label>
      </div>
      <p className="snapshot">
        {filtered.length} of {rows.length} features · MachinaLayout columnar
        table · synced {generated.generatedAt}
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Status</th>
              <th>Category</th>
              <th>Contract</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={`${row.category}-${row.feature}`}>
                <td>
                  <a href={docsRoute(String(row.feature))}>
                    <code>{String(row.feature)}</code>
                  </a>
                </td>
                <td>
                  <span
                    className={`status status-${String(row.status).toLowerCase().replaceAll(" ", "-")}`}
                  >
                    {String(row.status)}
                  </span>
                </td>
                <td>{String(row.category)}</td>
                <td>{String(row.summary)}</td>
                <td>{String(row.evidence)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InlineMarkdown({ source }: { source: string }) {
  const parts = keyedOccurrences(
    source.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g),
  );
  return (
    <>
      {parts.map(({ value: part, key }) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={key}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={key}>{part.slice(1, -1)}</code>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <a
              href={
                link[2].endsWith(".md")
                  ? "/aetheris/reference/language"
                  : link[2]
              }
              key={key}
            >
              {link[1]}
            </a>
          );
        return <Fragment key={key}>{part}</Fragment>;
      })}
    </>
  );
}

function MarkdownDocument({ source }: { source: string }) {
  const nodes: ReactNode[] = [];
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      nodes.push(
        <figure className="code-card" key={`code-${index}`}>
          <div className="code-toolbar">
            <span>{language || "text"}</span>
          </div>
          <pre className={language === "firmament" ? "firmament" : undefined}>
            {language === "firmament" ? (
              <FirmamentCode source={codeLines.join("\n")} />
            ) : (
              codeLines.join("\n")
            )}
          </pre>
        </figure>,
      );
      index += 1;
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = Math.min(heading[1].length + 1, 4);
      const title = heading[2].replaceAll("`", "");
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const Tag = `h${level}` as "h2";
      nodes.push(
        <Tag id={id} key={`heading-${index}`}>
          <InlineMarkdown source={heading[2]} />
        </Tag>,
      );
      index += 1;
      continue;
    }
    if (/^\d+\.\s/.test(line) || /^[-*]\s/.test(line)) {
      const ordered = /^\d+\.\s/.test(line);
      const items: string[] = [];
      const pattern = ordered ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;
      while (index < lines.length) {
        const match = lines[index].match(pattern);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      const children = keyedOccurrences(items).map(({ value, key }) => (
        <li key={key}>
          <InlineMarkdown source={value} />
        </li>
      ));
      nodes.push(
        ordered ? (
          <ol key={`list-${index}`}>{children}</ol>
        ) : (
          <ul key={`list-${index}`}>{children}</ul>
        ),
      );
      continue;
    }
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].startsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      const cells = tableLines
        .filter((_, rowIndex) => rowIndex !== 1)
        .map((row) =>
          row
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim()),
        );
      nodes.push(
        <div className="table-wrap" key={`table-${index}`}>
          <table>
            <thead>
              <tr>
                {cells[0].map((cell) => (
                  <th key={cell}>
                    <InlineMarkdown source={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cells.slice(1).map((row) => (
                <tr key={row.join("|")}>
                  {keyedOccurrences(row).map(({ value, key }) => (
                    <td key={key}>
                      <InlineMarkdown source={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,4})\s|^```|^\d+\.\s|^[-*]\s|^\|/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    nodes.push(
      <p key={`p-${index}`}>
        <InlineMarkdown source={paragraph.join(" ")} />
      </p>,
    );
  }
  return <div className="markdown-document">{nodes}</div>;
}

function ArchitectureDiagram({
  variant,
}: Extract<DocBlock, { kind: "architectureDiagram" }>) {
  const diagrams = {
    platform: [
      ["Firmament", "typed engineering intent"],
      ["AIR + SemanticValue", "compiler-owned meaning"],
      ["Exact BRep · CIR · AssemblyIR", "purpose-specific authority"],
      ["STEP · Mesh · FEA · assemblies", "ordinary consumers"],
    ],
    semantics: [
      ["Native · Template · Recognize · Forge", "producers"],
      [
        "SemanticValue",
        "identity · capabilities · exact bindings · provenance",
      ],
      ["Profile · Modify · FEA · Roles", "origin-independent consumers"],
    ],
    assembly: [
      ["Product tree", "ownership and occurrences"],
      ["Semantic Roles", "Point · Axis · Plane · Dimension"],
      ["Mate graph", "Interface lowering and residual freedoms"],
      ["Placement + dimensional graph", "transforms · Fits · stackup"],
    ],
    analysis: [
      ["Shared construction intent", "authored or admitted imported source"],
      ["Exact BRep + CIR", "boundary/topology + occupied continuum"],
      ["Lattice + Cut cells", "BoundaryOffsetMap and semantic regions"],
      ["Linear elasticity", "native results + Abaqus deck"],
    ],
  } as const;
  return (
    <figure
      className={`flow-diagram flow-${variant}`}
      aria-label={`${variant} architecture flow`}
    >
      {diagrams[variant].map(([title, detail], index) => (
        <Fragment key={title}>
          <div>
            <strong>{title}</strong>
            <span>{detail}</span>
          </div>
          {index < diagrams[variant].length - 1 && (
            <span className="flow-arrow" aria-hidden="true">
              →
            </span>
          )}
        </Fragment>
      ))}
    </figure>
  );
}

function CodeBlock({ block }: { block: Extract<DocBlock, { kind: "code" }> }) {
  const source = block.source
    ? generated.fixtures[block.source as keyof typeof generated.fixtures].source
    : (block.code ?? "");
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }
  return (
    <figure className="code-card">
      <div className="code-toolbar">
        <span>{block.filename ?? "example.firmament"}</span>
        <button type="button" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className={
          block.filename?.endsWith(".cs") || block.filename === "Program.cs"
            ? undefined
            : "firmament"
        }
      >
        {block.filename?.endsWith(".cs") ||
        block.filename === "Program.cs" ||
        block.filename === "PowerShell" ? (
          source
        ) : (
          <FirmamentCode source={source} />
        )}
      </pre>
      <figcaption>
        {block.caption}
        {block.demonstrates && (
          <span className="demonstrates">
            Demonstrates: {block.demonstrates}.
          </span>
        )}
        {block.fixture && (
          <a href={`${sourceRoot}${block.fixture}`}>Source and evidence</a>
        )}
      </figcaption>
    </figure>
  );
}

function Block({ block }: { block: DocBlock }) {
  return matchKind<DocBlock, ReactNode>(block, {
    html: (value) => (
      // biome-ignore lint/security/noDangerouslySetInnerHtml: blocks are trusted compile-time documentation authored in this repository, never user input.
      <div dangerouslySetInnerHTML={{ __html: value.html }} />
    ),
    markdown: (value) => <MarkdownDocument source={generated[value.source]} />,
    code: (value) => <CodeBlock block={value} />,
    matrix: (value) => <Matrix {...value} />,
    featureExplorer: () => <FeatureExplorer />,
    architectureDiagram: (value) => <ArchitectureDiagram {...value} />,
    figure: (value) => (
      <figure className="doc-figure">
        <img src={value.src} alt={value.alt} />
        <figcaption>{value.caption}</figcaption>
      </figure>
    ),
  });
}

function Sidebar({
  current,
  onNavigate,
}: { current: string; onNavigate: () => void }) {
  return (
    <nav className="sidebar" aria-label="Aetheris documentation">
      {NAV_GROUPS.map((group) => {
        const pages = DOC_PAGES.filter((page) => page.group === group);
        return (
          <section key={group}>
            <h2>{group}</h2>
            {pages.map((page) => (
              <a
                aria-current={page.route === current ? "page" : undefined}
                href={page.route}
                key={page.route}
                onClick={onNavigate}
              >
                {page.route === "/aetheris/" ? "Overview" : page.title}
              </a>
            ))}
          </section>
        );
      })}
    </nav>
  );
}

function Search({ close }: { close: () => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? DOC_PAGES.filter((page) =>
          [page.title, page.description, ...page.keywords]
            .join(" ")
            .toLowerCase()
            .includes(needle),
        )
      : DOC_PAGES.slice(0, 8);
  }, [query]);
  return (
    <dialog
      open
      className="search-panel"
      aria-label="Search Aetheris documentation"
    >
      <label htmlFor="doc-search">Search the documentation</label>
      <input
        id="doc-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="SemanticValue, tolerance, FEA…"
        value={query}
      />
      <div>
        {results.map((page) => (
          <a href={page.route} key={page.route} onClick={close}>
            <strong>{page.title}</strong>
            <span>{page.description}</span>
          </a>
        ))}
      </div>
    </dialog>
  );
}

function pageHeadings(page: DocPage) {
  return page.blocks.flatMap((block) => {
    if (block.kind === "html")
      return [...block.html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((match) =>
        match[1].replace(/<[^>]+>/g, ""),
      );
    if (block.kind === "markdown")
      return generated[block.source]
        .split("\n")
        .filter((line) => line.startsWith("## "))
        .map((line) => line.slice(3).replaceAll("`", ""));
    return [];
  });
}

export function AetherisDocs() {
  const current = normalizeRoute(window.location.pathname);
  const pageIndex = DOC_PAGES.findIndex(
    (candidate) => candidate.route === current,
  );
  const page = DOC_PAGES[pageIndex];
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNavOpen(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  if (!page)
    return (
      <main className="not-found">
        <p>404 · Aetheris</p>
        <h1>That page is not in the Preview 2 documentation.</h1>
        <a href="/aetheris/">Return to the overview</a>
      </main>
    );
  const previous = DOC_PAGES[pageIndex - 1];
  const next = DOC_PAGES[pageIndex + 1];
  return (
    <div className="docs-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="topbar">
        <a className="brand" href="/aetheris/">
          <span className="brand-mark">A</span>
          <span>
            <strong>Aetheris</strong>
            <small>Firmament V2 · Preview 2</small>
          </span>
        </a>
        <div>
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            aria-expanded={searchOpen}
          >
            Search <kbd>/</kbd>
          </button>
          <button
            type="button"
            className="nav-toggle"
            onClick={() => setNavOpen((value) => !value)}
            aria-expanded={navOpen}
          >
            Contents
          </button>
        </div>
      </header>
      {searchOpen && <Search close={() => setSearchOpen(false)} />}
      <div className="docs-grid">
        <div className={navOpen ? "nav-drawer open" : "nav-drawer"}>
          <Sidebar current={page.route} onNavigate={() => setNavOpen(false)} />
        </div>
        <main className="doc" id="main-content">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/aetheris/">Aetheris</a>
            <span>/</span>
            <span>{page.group}</span>
          </nav>
          <header className="page-header">
            {page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
            <h1>{page.title}</h1>
            <p>{page.description}</p>
          </header>
          {page.blocks.map((block, index) => (
            <Block block={block} key={`${page.route}-${index}`} />
          ))}
          <nav className="pager" aria-label="Adjacent documentation">
            {previous ? (
              <a href={previous.route}>
                <small>Previous</small>
                <strong>← {previous.title}</strong>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a href={next.route}>
                <small>Next</small>
                <strong>{next.title} →</strong>
              </a>
            ) : (
              <span />
            )}
          </nav>
        </main>
        <aside className="rail" aria-label="On this page">
          <p>On this page</p>
          {pageHeadings(page).map((heading) => (
            <span key={heading}>{heading}</span>
          ))}
        </aside>
      </div>
    </div>
  );
}

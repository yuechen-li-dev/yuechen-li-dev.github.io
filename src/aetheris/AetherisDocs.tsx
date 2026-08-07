import { useMemo, useState } from "react";
import capabilities from "./generated/preview1-capabilities.json";
import { DOC_PAGES, NAV_GROUPS } from "./content";
import { FirmamentCode } from "./FirmamentCode";
import { normalizeRoute } from "./routes";
import type { DocBlock, DocPage } from "./types";

const fixtureRoot = "https://github.com/yuechen-li-dev/Aetheris/blob/master/";

function Matrix({ headers, rows }: Extract<DocBlock, { type: "matrix" }>) {
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

function CapabilityMatrix() {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Capability</th>
            <th>Status</th>
            <th>Frozen scope</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {capabilities.features.map((feature) => (
            <tr key={feature.id}>
              <td>
                <code>{feature.id}</code>
              </td>
              <td>
                <span
                  className={`status status-${feature.status.toLowerCase()}`}
                >
                  {feature.status}
                </span>
              </td>
              <td>{feature.scope}</td>
              <td>
                {feature.fixturePaths.map((path) => (
                  <a
                    className="fixture-mini"
                    href={`${fixtureRoot}${path}`}
                    key={path}
                  >
                    {path.split("/").at(-1)}
                  </a>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="snapshot">
        Freeze {capabilities.commit.slice(0, 12)} · snapshot SHA-256{" "}
        {capabilities.sourceSha256.slice(0, 16)}…
      </p>
    </div>
  );
}

function HtmlBlock({ html }: { html: string }) {
  if (html.includes("data-capability-matrix")) {
    const [before, after] = html.split("<div data-capability-matrix></div>");
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: before }} />
        <CapabilityMatrix />
        <div dangerouslySetInnerHTML={{ __html: after }} />
      </>
    );
  }
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function Block({ block }: { block: DocBlock }) {
  if (block.type === "html") return <HtmlBlock html={block.html} />;
  if (block.type === "matrix") return <Matrix {...block} />;
  if (block.type === "figure")
    return (
      <figure className="doc-figure">
        <img src={block.src} alt={block.alt} />
        <figcaption>{block.caption}</figcaption>
      </figure>
    );
  return (
    <figure className="code-card">
      <pre className="firmament">
        <FirmamentCode source={block.code} />
      </pre>
      <figcaption>
        {block.caption && <span>{block.caption} </span>}Proven by{" "}
        <a href={`${fixtureRoot}${block.fixture}`}>{block.fixture}</a>.
      </figcaption>
    </figure>
  );
}

function Sidebar({
  current,
  onNavigate,
}: { current: string; onNavigate: () => void }) {
  return (
    <nav className="sidebar" aria-label="Aetheris manual">
      {NAV_GROUPS.map((group) => {
        const pages = DOC_PAGES.filter((page) => page.group === group);
        if (pages.length === 0) return null;
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
                {page.route === "/aetheris/" ? "What Aetheris Is" : page.title}
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
    if (!needle) return DOC_PAGES.slice(0, 6);
    return DOC_PAGES.filter((page) =>
      [page.title, page.description, ...page.keywords]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);
  return (
    <div className="search-panel">
      <label htmlFor="doc-search">Search the manual</label>
      <input
        autoFocus
        id="doc-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="CounterboreDepth, ExactRolling, verify…"
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
    </div>
  );
}

export function AetherisDocs() {
  const current = normalizeRoute(window.location.pathname);
  const pageIndex = DOC_PAGES.findIndex(
    (candidate) => candidate.route === current,
  );
  const page: DocPage | undefined = DOC_PAGES[pageIndex];
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  if (!page)
    return (
      <main className="not-found">
        <p>404 · Aetheris</p>
        <h1>That page is not in the frozen manual.</h1>
        <a href="/aetheris/">Return to the manual</a>
      </main>
    );
  const previous = DOC_PAGES[pageIndex - 1];
  const next = DOC_PAGES[pageIndex + 1];
  return (
    <div className="docs-shell">
      <header className="topbar">
        <a className="brand" href="/aetheris/">
          <span className="brand-mark">A</span>
          <span>
            <strong>Aetheris</strong>
            <small>Firmament V2 · Preview 1</small>
          </span>
        </a>
        <div>
          <button onClick={() => setSearchOpen((value) => !value)}>
            Search <kbd>/</kbd>
          </button>
          <button
            className="nav-toggle"
            onClick={() => setNavOpen((value) => !value)}
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
        <main className="doc">
          <nav className="breadcrumbs">
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
          <nav className="pager">
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
        <aside className="rail">
          <p>On this page</p>
          {page.blocks
            .flatMap((block) =>
              block.type === "html"
                ? [...block.html.matchAll(/<h2>(.*?)<\/h2>/g)].map((match) =>
                    match[1].replace(/<[^>]+>/g, ""),
                  )
                : [],
            )
            .map((heading) => (
              <span key={heading}>{heading}</span>
            ))}
        </aside>
      </div>
    </div>
  );
}

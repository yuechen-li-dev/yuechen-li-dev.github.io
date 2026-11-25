# yuechen-li-dev

Engineering documentation portal on GitHub Pages. The project directory links
to Aetheris, Copeland TS, and Oct.

The manual lives at `/aetheris/`. Its React/Vite source is in
`src/aetheris`, static route shells are emitted during the production build,
and technical diagrams live in `public/aetheris/assets`.

## Build and check

Use the TSPack release in `.tspack-version`, Node.js 22, and .NET 10.
The [Pages workflow](.github/workflows/pages.yml) pins and builds the Copeland CLI
from source. For a local build, build that same Copeland revision and set
`COPELAND_CLI` to the absolute path of its `Copeland.Cli.dll`. The default
location is `.tspack/copeland/Copeland.Cli.dll`.

```sh
tspack sync
tspack run build
tspack run docs-build
tspack run docs-check
tspack check
tspack audit
tspack run typecheck
tspack run test
tspack run preview
```

## Publish a document

Add a collection or page to [the project registry](content/projects.json).
A Markdown collection names a GitHub repository and a full commit SHA. Its
pages specify source files and stable slugs. Route slugs use lowercase letters,
digits, and single hyphens. The generator maps the page to
`/<project>/<page>/index.html` in the deployment artifact. Relative Markdown
links resolve to published pages when available and to the pinned GitHub source
otherwise. Raw HTML in the Markdown is escaped.

The Copeland compiler handles routes, duplicate detection, and HTML layouts.
The Node adapter fetches the pinned Markdown, parses it, and writes the files.
The resulting portal and pilot articles can be read with JavaScript disabled.

## Existing Aetheris manual

- `manifest.tsx` is the project contract.
- `package.json`, `tsconfig.json`, and `vite.config.ts` are compatibility/tooling projections.
- Lifecycle scripts are blocked by default.
- `tspack audit` checks the exact locked npm versions against OSV.dev and is a required deployment gate.
- `tspack run docs-sync` refreshes the hash-tied capability snapshot from a
  sibling `Aetheris` checkout and verifies every advertised fixture.
- `tspack run docs-check` validates stable routes, fixture attribution,
  snapshot structure, assets, and generated route shells.
- Pull requests build and validate `dist` on Linux. Pushes to `main` deploy it
  through GitHub Pages. Direct manual URLs have
  generated `index.html` shells beneath `/aetheris/`.

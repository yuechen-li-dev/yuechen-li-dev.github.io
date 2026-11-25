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

Create a `.tsx` file in [the pages directory](docs-compiler/src/pages) and
export a function returning a native `<Document>`. Use components such as
`<Heading>`, `<Paragraph>`, `<List>`, and `<CodeBlock>` for structure.
Prose supports Markdown-style bold, emphasis, inline code, and links.
Use root-relative paths for links between published pages.

Add a page ID, content function, and route metadata to the
[typed site registry](docs-compiler/src/Site.ts). Route slugs use lowercase
letters, digits, and single hyphens. The build writes a static page to
`/<project>/<page>/index.html`, with project navigation, a heading outline,
and the shared theme. The Copeland compiler checks the TSX structure and
emits typed document events. Node runs the compiled renderer and writes the
files. Readers can browse the portal and native articles with JavaScript
disabled.

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

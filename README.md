# yuechen-li-dev

Personal GitHub Pages site and the public Aetheris Preview 1 manual.

The manual lives at `/aetheris/`. Its React/Vite source is in
`src/aetheris`, static route shells are emitted during the production build,
and technical diagrams live in `public/aetheris/assets`.

## Commands

```sh
tspack update
tspack sync
tspack run dev
tspack run build
tspack run docs-check
tspack run typecheck
tspack check
tspack check --format
tspack update --policy --dry-run
```

## Notes

- `manifest.tsx` is the project contract.
- `package.json`, `tsconfig.json`, and `vite.config.ts` are compatibility/tooling projections.
- Lifecycle scripts are blocked by default.
- `tspack run docs-sync` refreshes the hash-tied capability snapshot from a
  sibling `Aetheris` checkout and verifies every advertised fixture.
- `tspack run docs-check` validates stable routes, fixture attribution,
  snapshot structure, assets, and generated route shells.
- Pushes to `main` deploy `dist` through GitHub Pages. Direct manual URLs have
  generated `index.html` shells beneath `/aetheris/`.

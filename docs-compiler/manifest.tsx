import { define, Package, Targets, Workspace } from "tspack/manifest";

export default define(
  <Workspace name="docs-portal" runtime="nodejs">
    <Package name="docs-portal" version="0.1.0" kind="app">
      <Targets
        rows={[
          { name: "node", entry: "src/Portal.ts", runtime: "dist/main.js", deps: [], peers: [] },
        ]}
      />
    </Package>
  </Workspace>,
);

import { define } from "tspack/manifest";

export default define(
    <Workspace name="article-panel" runtime="nodejs">
        <Package name="article-panel" version="1.0.0" kind="app">
            <Targets rows={[
                { name: "node", export: ".", entry: "src/Main.ts", runtime: "dist/main.js", deps: [], peers: [] },
            ]} />
        </Package>
    </Workspace>,
);

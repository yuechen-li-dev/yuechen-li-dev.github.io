import { defineTypeScriptWorkspace } from "copeland/workspace";

export default defineTypeScriptWorkspace({
    ownership: "partial",
    tscl: {
        project: "./ArticlePanel.csproj",
        include: ["src/**"],
        types: ["TextDocuments"],
        targets: { node: { backend: "javascript", runtime: "node" } },
    },
});

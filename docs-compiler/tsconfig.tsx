import { defineTypeScriptWorkspace } from "copeland/workspace";

export default defineTypeScriptWorkspace({
  ownership: "partial",
  tscl: {
    project: "./Docs.csproj",
    include: ["src/**"],
    targets: { node: { backend: "javascript", runtime: "node" } },
  },
});

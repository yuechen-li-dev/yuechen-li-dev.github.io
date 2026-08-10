import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { AETHERIS_ROUTES } from "./src/aetheris/routes";

function staticDocsRoutes() {
  return {
    name: "aetheris-static-routes",
    async closeBundle() {
      const root = process.cwd();
      const indexPath = resolve(root, "dist/index.html");
      const index = await readFile(indexPath, "utf8");
      for (const route of AETHERIS_ROUTES) {
        const directory = resolve(root, "dist", route.replace(/^\//, ""));
        await mkdir(directory, { recursive: true });
        const title =
          route === "/aetheris/"
            ? "Aetheris Preview 2"
            : `Aetheris · ${route.split("/").at(-1)?.replaceAll("-", " ")}`;
        const routed = index
          .replace("<title>yuechen-li-dev</title>", `<title>${title}</title>`)
          .replace(
            "</head>",
            `<link rel="canonical" href="https://yuechen-li-dev.github.io${route}" /></head>`,
          );
        await writeFile(resolve(directory, "index.html"), routed, "utf8");
      }
      await copyFile(indexPath, resolve(root, "dist/404.html"));
    },
  };
}

export default defineConfig({
  plugins: [react(), staticDocsRoutes()],
});

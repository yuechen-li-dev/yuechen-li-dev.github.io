import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(process.argv[2] ?? fileURLToPath(new URL("./dist/", import.meta.url)));
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
]);
const host = "127.0.0.1";
const port = Number(process.env.ARTICLE_PANEL_PORT ?? 4173);

createServer(async (request, response) => {
  try {
    const path = new URL(request.url, `http://${host}`).pathname;
    const relative = path.endsWith("/") ? path + "index.html" : path;
    const file = resolve(root, "." + relative);
    const type = mime.get(extname(file));
    if (!type || !file.startsWith(root + sep)) {
      response.writeHead(404).end("File not found");
      return;
    }
    const contents = await readFile(file);
    response.writeHead(200, { "Content-Type": type }).end(contents);
  } catch {
    response.writeHead(404).end("File not found");
  }
}).listen(port, host, () => console.log(`Article panel at http://${host}:${port}/`));

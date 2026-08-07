import type { AetherisRoute } from "./routes";

export type DocBlock =
  | { type: "html"; html: string }
  | { type: "code"; code: string; fixture: string; caption?: string }
  | { type: "matrix"; headers: string[]; rows: string[][] }
  | { type: "figure"; src: string; alt: string; caption: string };

export interface DocPage {
  route: AetherisRoute;
  group: string;
  title: string;
  eyebrow?: string;
  description: string;
  keywords: string[];
  blocks: DocBlock[];
}

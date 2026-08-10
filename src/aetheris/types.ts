import type { AetherisRoute } from "./routes";

export type Status =
  | "Supported"
  | "Experimental"
  | "Bounded"
  | "Legacy"
  | "Unsupported";

export type DocBlock =
  | { kind: "html"; html: string }
  | { kind: "markdown"; source: "languageReference" | "quickstart" }
  | {
      kind: "code";
      code?: string;
      source?: string;
      fixture?: string;
      filename?: string;
      caption?: string;
      demonstrates?: string;
    }
  | { kind: "matrix"; headers: string[]; rows: string[][] }
  | { kind: "featureExplorer" }
  | {
      kind: "architectureDiagram";
      variant: "platform" | "semantics" | "assembly" | "analysis";
    }
  | { kind: "figure"; src: string; alt: string; caption: string };

export interface DocPage {
  route: AetherisRoute;
  group: string;
  title: string;
  eyebrow?: string;
  description: string;
  keywords: string[];
  status?: Status;
  blocks: DocBlock[];
}

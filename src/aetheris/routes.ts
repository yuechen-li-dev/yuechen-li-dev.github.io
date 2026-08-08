export const AETHERIS_ROUTES = [
  "/aetheris/",
  "/aetheris/getting-started",
  "/aetheris/vscode",
  "/aetheris/why-aetheris",
  "/aetheris/firmament/language-tour",
  "/aetheris/firmament/concept-path",
  "/aetheris/firmament/static-authoring",
  "/aetheris/geometry/profiles-compose",
  "/aetheris/mechanical/holes",
  "/aetheris/mechanical/slots-patterns",
  "/aetheris/mechanical/edge-finishes",
  "/aetheris/semantics/require-pmi",
  "/aetheris/verification",
  "/aetheris/existing-step",
  "/aetheris/cli",
  "/aetheris/cookbook",
  "/aetheris/reference/language",
  "/aetheris/reference/support",
  "/aetheris/reference/diagnostics",
  "/aetheris/reference/compatibility",
  "/aetheris/for-llms",
  "/aetheris/architecture",
] as const;

export type AetherisRoute = (typeof AETHERIS_ROUTES)[number];

export function normalizeRoute(pathname: string): string {
  const withoutIndex = pathname.replace(/\/index\.html$/, "");
  if (withoutIndex === "/aetheris" || withoutIndex === "/aetheris/") {
    return "/aetheris/";
  }
  return withoutIndex.length > 1
    ? withoutIndex.replace(/\/$/, "")
    : withoutIndex;
}

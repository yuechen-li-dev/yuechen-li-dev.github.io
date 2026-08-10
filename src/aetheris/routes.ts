export const AETHERIS_ROUTES = [
  "/aetheris/",
  "/aetheris/getting-started",
  "/aetheris/why-aetheris",
  "/aetheris/firmament/philosophy",
  "/aetheris/firmament/language-tour",
  "/aetheris/firmament/values-tolerances",
  "/aetheris/firmament/records-tables-templates",
  "/aetheris/firmament/semantics",
  "/aetheris/firmament/datums-dimensions",
  "/aetheris/firmament/profiles-compose",
  "/aetheris/firmament/inline-step",
  "/aetheris/reference/language",
  "/aetheris/reference/features",
  "/aetheris/forge/host-sdk",
  "/aetheris/forge/extension-sdk",
  "/aetheris/forge/capability-lifecycle",
  "/aetheris/modules/architecture",
  "/aetheris/modules/surfacing",
  "/aetheris/modules/piping-sheet-metal",
  "/aetheris/geometry/exact-brep",
  "/aetheris/geometry/surface-mesh-ir",
  "/aetheris/analysis/continuum",
  "/aetheris/analysis/fea",
  "/aetheris/assemblies/interfaces-mates",
  "/aetheris/assemblies/tolerance-stackup",
  "/aetheris/drawings",
  "/aetheris/examples/bearing-module",
  "/aetheris/examples/template-block-pair",
  "/aetheris/examples/plate-with-hole",
  "/aetheris/examples/imported-step",
  "/aetheris/cli",
  "/aetheris/cookbook",
  "/aetheris/for-llms",
  "/aetheris/architecture",
  "/aetheris/vscode",
  "/aetheris/reference/diagnostics",
  "/aetheris/reference/compatibility",
  // Stable Preview 1 routes retained as aliases.
  "/aetheris/firmament/concept-path",
  "/aetheris/firmament/static-authoring",
  "/aetheris/geometry/profiles-compose",
  "/aetheris/mechanical/holes",
  "/aetheris/mechanical/slots-patterns",
  "/aetheris/mechanical/edge-finishes",
  "/aetheris/semantics/require-pmi",
  "/aetheris/verification",
  "/aetheris/existing-step",
  "/aetheris/reference/support",
] as const;

export type AetherisRoute = (typeof AETHERIS_ROUTES)[number];

export const ROUTE_ALIASES: Readonly<Record<string, AetherisRoute>> = {
  "/aetheris/firmament/concept-path": "/aetheris/firmament/profiles-compose",
  "/aetheris/firmament/static-authoring":
    "/aetheris/firmament/records-tables-templates",
  "/aetheris/geometry/profiles-compose": "/aetheris/firmament/profiles-compose",
  "/aetheris/semantics/require-pmi": "/aetheris/firmament/semantics",
  "/aetheris/verification": "/aetheris/cli",
  "/aetheris/existing-step": "/aetheris/firmament/inline-step",
  "/aetheris/reference/support": "/aetheris/reference/features",
  "/aetheris/mechanical/holes": "/aetheris/firmament/profiles-compose",
  "/aetheris/mechanical/slots-patterns": "/aetheris/firmament/profiles-compose",
  "/aetheris/mechanical/edge-finishes": "/aetheris/firmament/profiles-compose",
};

export function normalizeRoute(pathname: string): string {
  const withoutIndex = pathname.replace(/\/index\.html$/, "");
  const normalized =
    withoutIndex === "/aetheris" || withoutIndex === "/aetheris/"
      ? "/aetheris/"
      : withoutIndex.length > 1
        ? withoutIndex.replace(/\/$/, "")
        : withoutIndex;
  return ROUTE_ALIASES[normalized] ?? normalized;
}

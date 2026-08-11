import generated from "./generated/preview2-docs.json";
import type { DocBlock, DocPage } from "./types";

const html = (value: string): DocBlock => ({ kind: "html", html: value });
const code = (
  source: keyof typeof generated.fixtures,
  caption: string,
  demonstrates?: string,
): DocBlock => ({
  kind: "code",
  source,
  fixture: generated.fixtures[source].path,
  filename: generated.fixtures[source].path.split("/").at(-1),
  caption,
  demonstrates,
});
const literal = (
  codeText: string,
  filename: string,
  caption: string,
): DocBlock => ({ kind: "code", code: codeText, filename, caption });

const feaDisplacementMm =
  generated.measurements.fea.maximumDisplacementMeters * 1000;
const feaVonMisesMpa =
  generated.measurements.fea.maximumVonMisesPascal / 1_000_000;
const mesh = generated.measurements.mesh;

const page = (
  route: DocPage["route"],
  group: string,
  title: string,
  description: string,
  keywords: string[],
  blocks: DocBlock[],
  eyebrow?: string,
): DocPage => ({ route, group, title, description, keywords, blocks, eyebrow });

export const NAV_GROUPS = [
  "Start",
  "Firmament V2",
  "Forge",
  "Modules",
  "Geometry",
  "Analysis",
  "Assemblies",
  "Drawings",
  "Examples",
  "Tools & reference",
] as const;

export const DOC_PAGES: DocPage[] = [
  page(
    "/aetheris/modules/architecture",
    "Modules",
    "Engineering Modules own domain meaning",
    "Typed built-in Modules let engineering domains own vocabulary, validation, templates, and lowering without expanding the shared kernel into a giant generic CAD API.",
    ["Modules", "architecture", "capabilities", "Piping", "Surfacing"],
    [
      html(
        `<div class="callout"><strong>Modules are semantic packages, not UI workbenches or dynamic plug-ins.</strong><p>Core knows compiler and exact-geometry semantics. Modules know engineering-domain invariants.</p></div><h2>The M0 boundary</h2><p><code>AetherisModule</code> carries an explicit stable ID, semantic version, capabilities, Concepts, Templates, lowerings, diagnostics, bounded dependencies, and documentation metadata. Registration is explicit and deterministic: duplicate IDs, duplicate capability owners, missing or old dependencies, and dependency cycles are typed errors.</p><h2>Capability means two different things</h2><p>A Module capability such as <code>Piping.PipeRoute</code> says a domain compiler path is available. A <code>SemanticValue</code> capability such as <code>AxisCapable</code> proves what one result exposes. The types remain separate.</p><h2>Forge boundary</h2><p>Forge Host can inspect built-in Modules without KernelSDK. KernelSDK remains the advanced capability-development seam; ordinary Module users consume typed APIs and Templates.</p>`,
      ),
      {
        kind: "matrix",
        headers: ["Module", "M0 status", "Capabilities"],
        rows: [
          [
            "Aetheris.Surfacing 0.2.0",
            "Bounded",
            "Panel, ParametricSurface, RuledSurface, RuledTransition, SectionSurface, BoundaryPatch",
          ],
          ["Aetheris.Piping 0.1.0", "Bounded", "PathPipe, PipeRoute"],
          [
            "Aetheris.SheetMetal 0.1.0",
            "Reserved",
            "No implemented M0 capability",
          ],
        ],
      },
      html(
        "<p>M0 deliberately adds no Firmament import keyword. Module-owned Templates lower to ordinary canonical construction and capability boundaries use qualified IDs. This keeps the language small until native domain declarations create a real name-resolution problem.</p>",
      ),
    ],
    "AETHERIS-MODULE-M0",
  ),
  page(
    "/aetheris/modules/surfacing",
    "Modules",
    "Mathematical surfaces become engineering Panels",
    "Panel is the bounded, oriented engineering object above Parametric, Ruled, Section, and Boundary surface constructions, with semantic edges and developability evidence.",
    [
      "Surfacing",
      "Panel",
      "RuledSurface",
      "BoundaryPatch",
      "developability",
      "NURBS",
    ],
    [
      html(
        '<div class="callout"><strong>Surface is construction; Panel is the object people assemble.</strong><p>A Panel owns a bounded domain, orientation/material side, ordered semantic edges, stable corners, approximation and construction provenance, and developability evidence. It is not forced to be a closed solid.</p></div><h2>Ordinary Firmament authoring</h2><p><code>Panel Name { Surface: ParametricSurface { ... } }</code> and the named, RuledSurface, RuledTransition, BoundaryPatch, and SectionSurface variants lower through the production Surfacing IR. Panel Templates specialize from Records/Tables before the bridge.</p><h2>Semantic edges and seams</h2><p>Every four-sided Panel exposes South, East, North, West and SW/SE/NE/NW with deterministic IDs. Edge Roles use the existing Interface/Mate architecture. Exact G0 residuals and free edges are reported; G1 requests are explicitly diagnosed as unsupported. Mating never implies Boolean union.</p><h2>Fabrication seam</h2><p>Ruled does not mean developable. Developable, NonDevelopable, or Indeterminate evidence survives onto the Panel together with optional thickness/material metadata, forming the future Sheet Metal lowering seam without claiming flat patterns today.</p><h2>Representation boundary</h2><p>M0 Panels are BRep-backed. The semantic contract deliberately leaves room for future SubD or SDF backing without exposing raw BRep edge IDs or introducing arbitrary trim networks.</p>',
      ),
    ],
  ),
  page(
    "/aetheris/modules/piping-sheet-metal",
    "Modules",
    "Piping dogfood and the Sheet Metal pressure test",
    "PipeRoute lowers engineering centerline and section intent to exact analytic BRep; Sheet Metal reserves future developability and flat-pattern ownership.",
    ["Piping", "PipeRoute", "PathPipe", "Sheet Metal", "developability"],
    [
      html(
        "<h2>PipeRoute, not generic Sweep</h2><p>M0 admits a solid circular straight pipe and an inlet–90° planar bend–outlet route. Its line/arc/line centerline lowers to exact cylinder/torus/cylinder surfaces and ordinary STEP BRep. The circular-section frame transports seam phase deterministically with the route plane; generic twist knobs are unnecessary.</p><p>The semantic result exposes inlet/outlet points and axes, bend locations, diameter, and exact centerline identity. Hollow wall materialization, arbitrary 3D routes, branches, reducers, and route solving remain future work.</p><h2>Sheet Metal is reserved, not simulated</h2><p>The future Module owns neutral surface, thickness, formed state, bends and allowance, seams/reliefs, developability, and flat-pattern correspondence. This pressure required Surfacing M0 to retain construction and boundary provenance. No flattening is claimed today.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/",
    "Start",
    "Engineering intent that survives compilation",
    "Aetheris Preview 2 is an exact CAD compiler, typed engineering language, extension platform, analysis pipeline, and assembly compiler built on one semantic substrate.",
    ["overview", "CAD", "Firmament", "Forge", "FEA", "assembly"],
    [
      html(
        `<section class="hero-story"><p class="lede">Write the part as engineering intent. Keep its exact boundary. Name the geometry people care about. Then let the same names flow into meshes, analysis, host applications, and assemblies.</p><div class="hero-actions"><a class="primary-link" href="/aetheris/getting-started">Compile a first part</a><a href="/aetheris/architecture">See the platform map</a></div></section>`,
      ),
      { kind: "architectureDiagram", variant: "platform" },
      html(
        `<h2>One platform, several useful lowering paths</h2><div class="feature-grid"><article><h3>Firmament V2</h3><p>A statically evaluated, typed metaprogramming DSL for parts, semantics, analyses, and assemblies.</p></article><article><h3>Exact + structured geometry</h3><p>Exact BRep remains authoritative while SurfaceMeshIR preserves analytic supports and structured polygons before OBJ/STL lowering.</p></article><article><h3>Analysis with names</h3><p>Continuum and linear-elastic FEA bind constraints and loads to semantic geometry, not brittle anonymous element sets.</p></article><article><h3>Forge, without a kernel fork</h3><p>Host Firmament Templates or add trusted company-specific construction capabilities in C#.</p></article></div>`,
      ),
      html(
        `<h2>Preview 2, stated carefully</h2><p><strong>Supported</strong> means a current regression-tested contract. <strong>Bounded</strong> means real behavior with a deliberately limited domain. <strong>Experimental</strong> means implemented evidence exists but the contract may move. Unsupported capability is named rather than approximated.</p><p><a href="/aetheris/reference/features">Browse the implementation-synchronized feature status →</a></p>`,
      ),
      html(
        `<h2>Why this shape?</h2><ul><li>Semantic intent survives lowering.</li><li>Exact BRep is retained.</li><li>Parts are programs plus typed data.</li><li>Extensions do not require Kernel.Core forks.</li><li>Analysis binds to semantic geometry.</li><li>Assemblies know physical relationships.</li><li>Tolerance stackups are compiler analysis.</li></ul><p><a href="/aetheris/why-aetheris">Read the technical case for Aetheris →</a></p>`,
      ),
    ],
    "Aetheris · Preview 2",
  ),
  page(
    "/aetheris/getting-started",
    "Start",
    "Getting started with Firmament V2",
    "Progress from an exact part to typed data, semantic output, imported STEP, analysis, and an assembly without changing abstraction levels.",
    ["quickstart", "install", "build", "Model", "Template"],
    [
      html(
        `<div class="callout"><strong>Prerequisite</strong><p>Install the .NET SDK selected by Aetheris <code>global.json</code>, then run the CLI from the repository or an installed release.</p></div>`,
      ),
      literal(
        "dotnet run --project Aetheris.CLI -- validate part.firmament\ndotnet run --project Aetheris.CLI -- build part.firmament --output out/part.step\ndotnet run --project Aetheris.CLI -- inspect part.firmament --json",
        "PowerShell",
        "Validate, build exact STEP AP242, then inspect the semantic result.",
      ),
      { kind: "markdown", source: "quickstart" },
    ],
  ),
  page(
    "/aetheris/why-aetheris",
    "Start",
    "Why Aetheris?",
    "The architectural differences are less about syntax and more about what remains knowable after a part is compiled.",
    ["semantic intent", "exact BRep", "compiler", "tolerance"],
    [
      html(
        "<h2>CAD output is not the whole product</h2><p>Aetheris retains exact topology and a semantic graph. A face can still be “the bearing seat” when the same part reaches Selection, FEA, Forge, or an Assembly Role. That is more durable than teaching every downstream tool a particular edge number.</p><h2>Programs and data, not copied parts</h2><p>Records, Static Tables, <code>with</code>, and Templates make standards families inspectable compiler inputs. Specialization provenance records which row, override, Match arm, and argument produced an instance.</p><h2>Analysis is connected to authoring</h2><p>Loads and constraints resolve through exact semantic bindings. Assembly Fits and Relations become typed dimensional graph transitions. A worst-case stackup is checked during compilation with every contribution retained.</p><h2>Capability can arrive locally</h2><p>Forge extensions can contribute validated exact BRep, optional CIR associations, and semantic members. Company-specific construction need not expand the trusted general-purpose kernel.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/drawings",
    "Drawings",
    "A4 drawings are compiled views of the product",
    "Drawing M0B projects exact Part or occurrence-aware AssemblyIR into deterministic zoned A4 pages without creating a second engineering authority.",
    [
      "Drawing",
      "A4",
      "AssemblyIR",
      "BOM",
      "HLR",
      "PMI",
      "PDF",
      "React",
      "vector",
    ],
    [
      html(
        `<div class="callout"><strong>The semantic 3D product remains authoritative.</strong><p>A Drawing is a disposable, reproducible printable projection. Change the Part, AssemblyIR, PMI, tolerance, or metadata Record and compile it again.</p></div><h2>One compile path</h2><p>A normal Firmament Template returns <code>Drawing</code>. It binds a Part or Assembly Product plus typed <code>DrawingInfo</code>. Assembly leaves are projected with their resolved world transforms and occurrence identities intact. Exact BRep edge intervals are classified by bounded face occlusion, semantic PMI is laid out, BOM is derived from AssemblyIR, and DrawingIR feeds sibling React/SVG and native vector PDF renderers.</p>`,
      ),
      literal(
        `Static MachineDrawingInfo = AsterDrawingDefaults with { Revision: 1.1.0 Date: 2026-08-10 }
Template < Item: Product, Metadata: DrawingInfo >
Drawing StandardAssemblyDrawing: AssemblyProductionDrawing {
  Source: Item
  Metadata: Metadata
  BOM: true
  View Front { Direction: +Z HiddenLines: VisibleAndHidden PMI: [MachineOffset] }
  View Iso { Direction: [1,1,1] Projection: Isometric HiddenLines: VisibleOnly PMI: [] }
}
Drawing MachineAssemblyProduction = StandardAssemblyDrawing<Product: Machine, Metadata: MachineDrawingInfo>`,
        "machine-assembly-drawing.firmament",
        "The canonical Machine/BearingModule Drawing Concept, structured metadata, occurrence-aware views, semantic PMI, and AssemblyIR BOM.",
      ),
      {
        kind: "figure",
        src: "/aetheris/assets/preview2/machine-assembly-drawing.png",
        alt: "A4 machine assembly drawing with occurrence-aware orthographic and isometric views, semantic zones, and structured information block",
        caption:
          "Page 1 of the canonical nested Machine/BearingModule output. Its AssemblyIR-derived BOM is a real table on page 2.",
      },
      {
        kind: "figure",
        src: "/aetheris/assets/preview2/bearing-block-drawing.png",
        alt: "Upgraded A4 bearing block part drawing with semantic PMI, perimeter zones, Inter typography, and CODEX release attribution",
        caption:
          "The Part path uses the same DrawingInfo, zone, typography, information-block, and deterministic native PDF contracts; its design table remains on page 2.",
      },
      html(
        "<h2>Bounded M0B contract</h2><ul><li>A4 portrait or landscape with stable A-D / 1-6 semantic zones;</li><li>manual orthographic/isometric views and manual PMI assignment;</li><li>occurrence-aware nested AssemblyIR projection without Boolean flattening;</li><li>VisibleOnly/VisibleAndHidden interval classification with split and unsupported-support evidence;</li><li>flattened leaf-part BOM from AssemblyIR;</li><li>typed Version/Date DrawingInfo with Static/with provenance;</li><li>searchable native PDF with embedded Inter and no raster pages.</li></ul><p>The HLR oracle is deliberately bounded by admitted face tessellation; unsupported patches are explicit and conservative. Sections/details, exploded views, and complete ISO/ASME coverage remain future work.</p>",
      ),
    ],
    "Drawing M0B · assembly and production-document closeout",
  ),
  page(
    "/aetheris/firmament/philosophy",
    "Firmament V2",
    "Firmament is compiler metaprogramming for engineering",
    "Firmament expresses engineering intent and deterministic compile-time variation; it is not a runtime scripting environment.",
    ["language philosophy", "metaprogramming", "Kernel", "Forge"],
    [
      html(
        `<h2>What it is</h2><p>Firmament is Aetheris's typed compiler metaprogramming DSL. It declares immutable values, construction intent, semantic contracts, analysis bindings, and physical relationships. Records, Tables, Templates, Match, Pattern, and Require are evaluated before feature AIR.</p><h2>What it is not</h2><ul><li>not C++ for CAD;</li><li>not Python embedded in a CAD session;</li><li>not a mutable runtime scripting language;</li><li>not a general symbolic mathematics system.</li></ul><h2>Three boundaries</h2><dl class="definition-grid"><dt>Firmament</dt><dd>Engineering intent and compiler metaprogramming.</dd><dt>Forge</dt><dd>Typed host embedding and trusted extension capabilities.</dd><dt>Kernel</dt><dd>The proven shared substrate for exact construction, topology, semantics, and lowering.</dd></dl>`,
      ),
      { kind: "architectureDiagram", variant: "platform" },
    ],
  ),
  page(
    "/aetheris/firmament/language-tour",
    "Firmament V2",
    "Language tour",
    "A map of Firmament's compile-time values, geometric construction, semantics, analysis, and relational assembly declarations.",
    ["tour", "Model", "Concept", "Template", "Analysis", "Assembly"],
    [
      code(
        "tableTemplate",
        "A complete Table → Record → Template → Concept Path → Compose workflow.",
        "Static data, specialization, semantic construction, and exact geometry",
      ),
      html(
        `<h2>Read the language in layers</h2><ol><li><strong>Values:</strong> Units, literals, <code>let</code>, <code>tol</code>, Records, Tables, and <code>with</code>.</li><li><strong>Intent:</strong> Concepts, Structs, Expose, semantic datums, Profiles, Compose, Modify, and bounded features.</li><li><strong>Compile-time variation:</strong> Templates, Match, Pattern, and Require.</li><li><strong>Consumers:</strong> imported STEP recognition, FEA Analysis, Interfaces/Mates, and assertions.</li></ol><p>The <a href="/aetheris/reference/language">language reference</a> is normative. Guides explain why and when to use the constructs.</p>`,
      ),
    ],
  ),
  page(
    "/aetheris/firmament/values-tolerances",
    "Firmament V2",
    "Values, units, let, and tolerance",
    "Typed immutable values drive nominal geometry while tolerance remains symbolic engineering intent.",
    ["let", "tol", "PlusMinus", "Dimension", "units"],
    [
      literal(
        "Model Spacer {\n    Units: mm\n    let Bore: Length = 20mm tol PlusMinus(0.01mm)\n    let Seat: Length = 5mm tol PlusMinus(0.03mm, 0.02mm)\n}",
        "spacer-values.firmament",
        "Canonical Model spelling for bilateral and asymmetric tolerances.",
      ),
      html(
        "<h2>Nominal geometry stays nominal</h2><p><code>tol</code> attaches an interval to a nominal Length or Angle. Aetheris does <strong>not</strong> randomly perturb the geometry and does not turn a tolerance into a Monte Carlo instruction. Exact construction receives the nominal value; symbolic interval propagation feeds validation and stackups.</p><h2><code>let</code> versus <code>Dimension</code></h2><p>An ordinary <code>let Length</code> is a compile-time scalar. An Assembly <code>Dimension</code> is a named semantic value with <code>DimensionalCapable</code>, an exact toleranced binding, stable provenance, and eligibility for Fits and dimensional paths.</p><h2>Provenance survives specialization</h2><p>When a value comes from a Table row, a <code>with</code> derivation, or a Template argument, the specialization artifacts preserve that chain. Stackup reports can therefore say which standards row or override contributed an interval.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/firmament/records-tables-templates",
    "Firmament V2",
    "Records, Static Tables, with, and Templates",
    "Encode finite engineering families as typed data and specialize deterministic construction without copy-paste parts.",
    [
      "Record",
      "Static Table",
      "with",
      "Template",
      "Match",
      "Pattern",
      "Require",
    ],
    [
      code(
        "hexBolt",
        "The canonical standards-driven HexBolt family.",
        "Keyed standard rows, with-derived specifications, Template specialization, and semantic output",
      ),
      html(
        "<h2>The compilation order matters</h2><p>Records and Tables bind first. <code>with</code> creates a rechecked immutable record. Template parameters and defaults bind next; Require and Match select an admitted specialization; Pattern expands finite sources. Only then does feature AIR see the materialized declarations.</p><h2>Diagnostics are part of the contract</h2><p>Missing fields, wrong types, duplicate Table keys, unequal columns, default cycles, failed Require predicates, and recursive specializations are compile errors. Specialization identity and provenance are deterministic.</p><h2>Use a Table when the family is finite</h2><p>A keyed Static Table is a good fit for standard sizes. A general algorithm belongs in a Template or Forge capability—not in duplicated prose or hand-maintained JSON beside the source.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/firmament/semantics",
    "Firmament V2",
    "SemanticValue: one contract across origins",
    "Native, imported, Template-produced, and Forge-produced values meet consumers through capabilities and exact bindings.",
    [
      "SemanticValue",
      "SemanticReference",
      "capabilities",
      "provenance",
      "Concept Path",
    ],
    [
      { kind: "architectureDiagram", variant: "semantics" },
      html(
        "<h2>The normalized value</h2><p>A <code>SemanticReference</code> records the resolved path and consumer span. Its <code>SemanticValue</code> carries stable identity, structural capabilities, exact bindings, exposed children, authored/generated spans, and ordered provenance.</p><h2>Capability first, origin second</h2><p>Consumers ask for capabilities such as Boundary, Selectable, ExactPlane, AnalysisRegion, Axis, Plane, Point, or Dimension. Exact claims require exact bindings. The check is the same whether the producer was native Firmament, InlineStep/Recognize, a Template expansion, or Forge.</p><h2>Concept Path is a semantic construction</h2><p>A named Path and its segments retain identity through Profile and Compose. This is why downstream code can select an exposed concept rather than reverse-engineer topology IDs.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/firmament/datums-dimensions",
    "Firmament V2",
    "Point, Axis, Plane, and Dimension",
    "Exact datum semantics connect authored parts to assembly placement, selection, and analysis contracts.",
    ["Point", "Axis", "Plane", "Dimension", "Semantic"],
    [
      literal(
        "Semantic Joint {\n    Point Origin = [0,0,0];\n    Axis Axis = [0,0,0] -> [0,0,1];\n    Plane Seat = [0,0,10] normal [0,0,1];\n    Dimension Diameter = 20mm tol +0.01mm -0.008mm;\n}",
        "joint-semantics.firmament",
        "Canonical Assembly-local exact datum syntax.",
      ),
      html(
        `<h2>Bindings and capabilities</h2><div class="table-wrap"><table><thead><tr><th>Declaration</th><th>Exact binding</th><th>Primary uses</th></tr></thead><tbody><tr><td>Point</td><td>ExactPoint</td><td>anchors, coincidence, dimensional endpoints</td></tr><tr><td>Axis</td><td>origin + normalized direction</td><td>coaxial placement, rotational freedom</td></tr><tr><td>Plane</td><td>origin + oriented normal</td><td>seating, fixed regions, planar selection</td></tr><tr><td>Dimension</td><td>nominal/lower/upper/unit</td><td>Fit, Relations, tolerance stackup</td></tr></tbody></table></div><p>Definition-local bindings compose with each Part occurrence transform for world queries. Opposite Plane normals are currently angularly coincident; material-side meaning is not inferred.</p>`,
      ),
    ],
  ),
  page(
    "/aetheris/firmament/profiles-compose",
    "Firmament V2",
    "Profiles, Concept Path, Compose, and Modify",
    "Construct exact planar intent, build bounded bodies, and apply admitted semantic modifications.",
    [
      "Profile",
      "Concept Path",
      "Compose",
      "Modify",
      "Hole",
      "Pattern",
      "EdgeFinish",
      "Selection",
    ],
    [
      code(
        "profileBracket",
        "A compile-tested L-bracket profile with counterbore and projected PMI.",
        "Concept Path/Profile, Compose, Modify, semantic feature selection, and PMI",
      ),
      html(
        "<h2>Path is intent, Profile is admitted geometry</h2><p><code>Concept Path</code> is an ordered planar construction of named Line/Arc/Close steps. Continuity, positive measures, winding, and stable provenance are checked before <code>Profile Name From Path</code> produces an exact profile.</p><h2>Bounded on purpose</h2><p><code>Compose</code> and <code>Modify</code> route to supported exact construction families. Holes, slots, patterns, and edge finishes are admitted by topology and termination policy. Unsupported combinations fail with diagnostics instead of silently approximating a general CAD operation.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/firmament/inline-step",
    "Firmament V2",
    "InlineStep, Recognize, and Replace",
    "Bring canonical exact AP242 into the semantic pipeline without claiming arbitrary design-history recovery.",
    ["InlineStep", "Recognize", "Replace", "STEP", "imported CAD"],
    [
      code(
        "inlineStep",
        "The canonical imported through-hole recognize-and-replace fixture.",
        "Exact STEP import, evidence-backed recognition, SemanticValue, and bounded rematerialization",
      ),
      html(
        "<h2>Existing CAD is first-class—within explicit bounds</h2><p><code>InlineStep</code> accepts canonical exact AP242 supported by the importer. <code>Recognize</code> binds verified face IDs to a named semantic region with evidence and confidence. The resulting SemanticValue can enter supported Selection, FEA, PMI, and Modify consumers.</p><h2>What recognition does not promise</h2><p>It does not reconstruct arbitrary feature history, manufacture exact Profiles from every imported loop, or infer Assembly datum capabilities. <code>Replace</code> currently supports a bounded recognized through-hole rematerialization workflow with verification.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/reference/language",
    "Firmament V2",
    "Definitive Firmament V2 language reference",
    "The public, implementation-synchronized syntax and semantics contract for Supported and explicitly bounded language features.",
    ["reference", "syntax", "grammar", "Firmament V2"],
    [
      html(
        `<div class="source-note"><strong>Canonical source</strong><span>${generated.sources.languageReference}</span><code>sha256 ${generated.hashes.languageReference.slice(0, 16)}…</code></div>`,
      ),
      { kind: "markdown", source: "languageReference" },
    ],
  ),
  page(
    "/aetheris/reference/features",
    "Firmament V2",
    "Language and platform feature status",
    "A searchable status explorer generated from the language audit and Preview 2 feature manifest.",
    ["status", "Supported", "Experimental", "Bounded", "feature matrix"],
    [
      html(
        "<h2>How to read status</h2><p><strong>Supported</strong> is the current regression-tested contract. <strong>Bounded</strong> is a real, tested domain with named edges. <strong>Experimental</strong> has implementation evidence but a moving public contract. <strong>Legacy</strong> remains only for compatibility. Unsupported work is not approximated.</p>",
      ),
      { kind: "featureExplorer" },
    ],
  ),
  page(
    "/aetheris/forge/host-sdk",
    "Forge",
    "Forge Host SDK",
    "Embed Aetheris through typed Template invocation and validated result artifacts rather than raw kernel calls.",
    ["ForgeHost", "C#", "Template invocation", "SDK"],
    [
      code(
        "forgeHost",
        "The current compile-tested Forge host/evidence program.",
        "Module loading, generated typed binding, exact BRep/CIR targets, determinism, provenance, validation, and artifact access",
      ),
      html(
        `<h2>The supported host boundary</h2><p>Forge binds typed parameters, imported STEP resources, compiler diagnostics, deterministic provenance, and result artifacts. The repository's generated sample bindings demonstrate the exact callable surface. Raw Kernel.Core construction is not the recommended embedding API.</p><h2>Results stay ordinary</h2><p>A successful invocation can return exact STEP/BRep artifacts, optional CIR association, semantic roots/members, and analysis output. Those semantic members participate in the same downstream capability checks as native Firmament values.</p><p><a href="https://github.com/yuechen-li-dev/Aetheris/tree/master/Aetheris.Forge.SampleExtension.Bindings">Open the compile-tested generated binding sample →</a></p>`,
      ),
    ],
  ),
  page(
    "/aetheris/forge/extension-sdk",
    "Forge",
    "Forge Extension SDK",
    "Add trusted company-specific construction with descriptors, typed validation, exact output, and semantic members—without modifying Kernel.Core.",
    ["Forge extension", "capability descriptor", "ConstructionIR", "ExactBrep"],
    [
      code(
        "forgeExtension",
        "The current compile-tested sample extension.",
        "Capability descriptor, typed admission, ConstructionIR, exact BRep, optional CIR, SemanticValue members, provenance, and deterministic output",
      ),
      html(
        `<h2>Descriptor → validate → construct → validate output</h2><p>An extension declares a stable capability descriptor and typed fields. It validates inputs, returns one admitted ConstructionIR or validated ExactBrep output, and may attach CIR association and SemanticValues. Forge validates artifact integrity and provenance at the trust boundary.</p><h2>Bounded extension contract</h2><p>Capabilities are explicitly registered and trusted. Current output tiers are bounded; general plugin discovery, arbitrary nested assembly output, and unrestricted loft/source generation are not production contracts.</p><p><a href="https://github.com/yuechen-li-dev/Aetheris/tree/master/Aetheris.Forge.SampleExtension">Open the real sample extension →</a></p>`,
      ),
    ],
  ),
  page(
    "/aetheris/forge/capability-lifecycle",
    "Forge",
    "Capability lifecycle",
    "Keep experimental local construction local, then graduate only broadly reusable and fully proven substrate.",
    ["capability", "graduation", "extension", "Kernel"],
    [
      html(
        `<h2>Local first</h2><p>A missing company-specific feature starts as an explicitly registered Forge capability. Its descriptor, validation, exact output, semantic members, determinism, and performance are testable without increasing Kernel.Core's permanent surface.</p><h2>Graduation is evidence-based</h2><p>A capability belongs in shared Kernel/StandardLibrary only when its semantics are general, its failure domain is understood, exact construction is proven, and downstream contracts no longer depend on extension-specific behavior.</p>`,
      ),
    ],
  ),
  page(
    "/aetheris/geometry/exact-brep",
    "Geometry",
    "Exact BRep and STEP AP242",
    "Exact boundary and topology remain authoritative for construction, inspection, verification, and interchange.",
    ["BRep", "STEP", "AP242", "exact geometry"],
    [
      html(
        "<h2>Exact does not mean anonymous</h2><p>Firmament lowers admitted construction to exact BRep and deterministic STEP AP242 while preserving semantic source maps. Verification can reimport output, inspect topology and analytic surfaces, and evaluate mass properties such as <code>Assert Volume</code>.</p><h2>Dual representations have different jobs</h2><p>BRep describes the exact boundary/topology. CIR describes occupied continuum. SurfaceMeshIR describes a structured surface discretization. None is treated as a lossy replacement for all the others.</p>",
      ),
      code(
        "bareBox",
        "The smallest canonical exact part.",
        "Model, Units, exact primitive construction, and deterministic STEP output",
      ),
    ],
  ),
  page(
    "/aetheris/geometry/surface-mesh-ir",
    "Geometry",
    "SurfaceMeshIR: structured surfaces before triangles",
    "Lower exact STEP/Firmament geometry into analytic-support-aware quads and polygons, then export OBJ or STL.",
    ["SurfaceMeshIR", "OBJ", "STL", "mesh", "HexBolt", "CTC-01"],
    [
      {
        kind: "figure",
        src: "/aetheris/assets/preview2/hexbolt-isometric.png",
        alt: "Actual generated isometric HexBolt geometry",
        caption:
          "Actual HexBolt Template output used by the Preview 2 evidence lane.",
      },
      {
        kind: "figure",
        src: "/aetheris/assets/preview2/hexbolt-surface-mesh.png",
        alt: "SurfaceMeshIR provenance visualization for CTC-01 faces",
        caption:
          "Actual generated SurfaceMeshIR provenance view for bounded CTC-01 feature bands.",
      },
      html(
        "<h2>Triangles are a target, not the internal language</h2><p>SurfaceMeshIR retains analytic supports, trim provenance, feature bands, and structured quads/polygons. OBJ can preserve polygon structure; STL is an explicitly triangulated lowering target.</p><h2>Current boundary</h2><p>Preview 2 covers analytic supports, planar holes/bands, Hyperbola and sampled non-rational B-spline trims. NURBS support surfaces are not claimed. HexBolt and CTC-01 are the evidence fixtures.</p>",
      ),
      html(
        `<h2>Measured HexBolt OBJ result</h2><div class="metric-strip"><div><strong>${mesh.patchCount}</strong><span>surface patches</span></div><div><strong>${mesh.polygonCount}</strong><span>polygons</span></div><div><strong>${mesh.quadPercentage.toFixed(1)}%</strong><span>quads</span></div><div><strong>${mesh.watertight ? "yes" : "no"}</strong><span>watertight</span></div></div><p>${mesh.pipeline}; ${mesh.finalTriangleCount} triangles only after final target lowering. These values come from the synchronized Preview 2 mesh evidence JSON.</p>`,
      ),
      literal(
        "aetheris mesh part.step --format obj --output part.obj --debug-ir part.mesh.json --json\naetheris mesh part.firmament --format stl --output part.stl --json",
        "PowerShell",
        "Current mesh CLI syntax.",
      ),
    ],
  ),
  page(
    "/aetheris/analysis/continuum",
    "Analysis",
    "Continuum: from exact boundary to occupied domain",
    "CIR supplies a representation of occupied continuum for analysis while exact BRep remains the boundary/topology authority.",
    ["CIR", "Continuum", "SDF", "Cut cells", "BoundaryOffsetMap"],
    [
      { kind: "architectureDiagram", variant: "analysis" },
      html(
        "<h2>Why a continuum representation exists</h2><p>FEA needs volume occupancy, interior cells, and boundary integration—not only a list of exact faces. Shared constructive intent dual-lowers to exact BRep and CIR. SDF is a CIR backend, not the authority replacing BRep.</p><h2>Regular lattice, honest boundary</h2><p>Interior regions use a regular lattice. Boundary-intersecting cells become Cut cells. <code>BoundaryOffsetMap</code> and graphics-inspired multisample boundary sampling retain local boundary placement for integration and constraints.</p><h2>Deliberate limits</h2><p>Aetheris does not assume arbitrary BRep-to-CIR recovery or CIR/SDF-to-exact-BRep reconstruction. Supported native and imported domains are admitted explicitly.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/analysis/fea",
    "Analysis",
    "Linear-elastic FEA with semantic boundary conditions",
    "Compile supported Firmament Analysis declarations to AnalysisIR, Continuum Cut cells, a native linear-elastic solve, and an Abaqus verification deck.",
    ["FEA", "Analysis", "material", "traction", "force", "pressure", "Abaqus"],
    [
      code(
        "plateWithHole",
        "The canonical plate-with-hole linear-elastic analysis.",
        "Semantic regions, material, fixed boundary, load, requested results, native solve, and deck export",
      ),
      html(
        "<h2>Supported declaration</h2><p>An <code>Analysis</code> names a native or admitted InlineStep source, one isotropic material, fixed-displacement regions, traction vectors, resultant-force vectors, pressure scalars, and requested Displacement, Strain, Stress, or ReactionForce fields. Regions must resolve to exact semantic bindings.</p><h2>Lowering and solve</h2><p>AnalysisIR contains engineering regions rather than node IDs. Continuum creates a regular lattice and Cut-cell boundary representation. The current native solver implements bounded small-strain linear isotropic elasticity.</p><h2>Verification export</h2><p>The CLI emits an Abaqus <code>.inp</code> verification deck where the discretization is representable. Aetheris does not claim that commercial Abaqus was executed; users need their own Abaqus installation.</p>",
      ),
      html(
        `<h2>Measured canonical result</h2><div class="metric-strip"><div><strong>${feaDisplacementMm.toFixed(6)} mm</strong><span>maximum displacement</span></div><div><strong>${feaVonMisesMpa.toFixed(3)} MPa</strong><span>maximum von Mises stress</span></div><div><strong>${generated.measurements.fea.residualNewton.toExponential(3)} N</strong><span>force residual</span></div></div><p>These values are synchronized from the current native result packet, not copied into prose.</p>`,
      ),
      literal(
        "aetheris fea docs/fea/artifacts/m5/plate-with-hole.firmament --out-dir artifacts/plate --json",
        "PowerShell",
        "Runs the native solve and writes analysis/result artifacts plus the Abaqus input deck.",
      ),
    ],
  ),
  page(
    "/aetheris/assemblies/interfaces-mates",
    "Assemblies",
    "Interfaces, Roles, Mates, and placement",
    "Describe physical relationships independently from the product tree, then lower them into instance transforms and dimensional consequences.",
    [
      "Interface",
      "Role",
      "Mate",
      "Assembly",
      "Anchor",
      "Lower",
      "Fit",
      "Allow",
    ],
    [
      { kind: "architectureDiagram", variant: "assembly" },
      html(
        `<h2>The mental model</h2><p><strong>Concepts describe one thing.</strong> Interfaces describe a physical relationship between named Roles. Mates instantiate an Interface with actual Part semantics.</p><p>The Assembly product structure is a tree: one occurrence has one structural parent. Mate topology is a graph: physical relationships can cross structural branches.</p><h2><code>.firmasm</code> is current</h2><p><code>.firmasm</code> is the Firmament V2 Assembly document profile, not a separate language or deprecated extension. It uses the ordinary parser and requires exactly one root Assembly. Only the old JSON-shaped syntax is legacy.</p><h2>STEP product structure</h2><p>Explicit AP242 occurrence hierarchy and rigid transforms are preserved without inventing Mates. When STEP proves only multiplicity, Aetheris deliberately normalizes multiple independent rigid products to a flat Assembly instead of preserving an ambiguous multi-body-versus-assembly ontology. Shared definitions remain separate from occurrences.</p><h2>Physical validity gate</h2><p>After exact materialization and placement, proven positive-volume interference between closed convex planar occurrence BReps is a fatal compile diagnostic. Face, edge, and point seating contact remains legal. Bounding boxes are never sufficient collision evidence, so unsupported curved or non-convex pairs are not guessed.</p><h2>Placement authority</h2><dl class="definition-grid"><dt>MateDerived</dt><dd>Native engineering intent resolved from Interface/Mate constraints.</dd><dt>ImportedOccurrence</dt><dd>Trustworthy foreign occurrence placement; no Mate is inferred.</dd><dt>LegacyExplicit</dt><dd>Compatibility evidence migrated from JSON-shaped <code>.firmasm</code>.</dd></dl><h2>Cadmata</h2><p>Cadmata renders definition geometry once and instances it with occurrence world transforms. Product-tree selection is occurrence-specific; the Mate/Interface relationship table remains conceptually separate.</p><h2>Relational vocabulary</h2><dl class="definition-grid"><dt>Role requires</dt><dd>Capabilities a participant must provide.</dd><dt>Lower</dt><dd>Axis/Plane/Point coincidence, alignment, or axial offset consequences.</dd><dt>Fit</dt><dd>A typed clearance interval and dimensional transition—not an ISO fit-class database.</dd><dt>Allow</dt><dd>An admitted residual translation or rotation freedom.</dd><dt>Anchor</dt><dd>The owning occurrence fixed at identity before Mate solving.</dd></dl>`,
      ),
      code(
        "templateBlockPair",
        "Template-produced definitions instantiated and placed through a typed Interface.",
        "Definitions versus occurrences, semantic world transforms, residuals, Fit, and Template provenance",
      ),
      literal(
        "aetheris asm inspect fixtures/AssemblyM1/template-block-pair.firmament --json --out artifacts/template-block-pair.json",
        "PowerShell",
        "Inspect the product tree, Mate table, placements, residuals, and tolerance result.",
      ),
    ],
  ),
  page(
    "/aetheris/assemblies/tolerance-stackup",
    "Assemblies",
    "Automatic worst-case tolerance stackup",
    "Compile a deterministic dimensional path, propagate signed intervals, and retain the complete provenance chain.",
    [
      "tolerance stackup",
      "Relation",
      "Fit",
      "Assert ToleranceStackup",
      "worst case",
    ],
    [
      html(
        `<h2>Compiler analysis, not geometry jitter</h2><p>Dimensions, Interface Fits, and explicit Relations form a bounded directed dimensional graph. <code>Assert ToleranceStackup</code> finds one deterministic path, sums signed nominal/lower/upper contributions, retains every source, and fails compilation if the minimum clearance requirement is not met.</p><h2>Pass and fail are both fixtures</h2><p>The bearing module's passing and intentionally failing sources differ at the requirement. Both exercise the real analyzer and prove that the assertion is an enforced compiler gate.</p>`,
      ),
      code(
        "bearingModule",
        "Passing bearing-module axial reach stackup.",
        "Toleranced Dimensions, Interface Fits, explicit Relations, deterministic path search, and provenance",
      ),
      code(
        "bearingModuleFailing",
        "Intentional failing stackup used to regression-test the diagnostic.",
        "The same graph with an unsatisfied minimum clearance",
      ),
    ],
  ),
  page(
    "/aetheris/examples/bearing-module",
    "Examples",
    "Showcase: bearing module",
    "A coherent assembly fixture combining semantic datums, Fits, Mates, product structure, and a six-contribution tolerance path.",
    ["bearing", "shaft", "housing", "spacer", "showcase"],
    [
      { kind: "architectureDiagram", variant: "assembly" },
      code(
        "bearingModule",
        "Canonical, compile-tested bearing-module source.",
        "Housing, bearing, spacer, and shaft across product-tree branches and Mate/dimensional graphs",
      ),
      literal(
        "aetheris asm inspect fixtures/AssemblyM0/bearing-module.firmament --json",
        "PowerShell",
        "Returns the product tree, Mate table, placement solution, dimensional graph, and assertion result.",
      ),
      html(
        "<h2>Why this is a signature example</h2><p>The fixture does not add unrelated FEA. It stays focused on the physical module: shaft/bore clearance, seated-axis placement, named Datum/Seat/Shoulder points, standards-style Relation provenance, and a worst-case axial reach assertion.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/examples/template-block-pair",
    "Examples",
    "Showcase: Template-produced assembly",
    "A compact second combined fixture proving that Record/Template output becomes ordinary semantic assembly input.",
    ["Template", "Record", "assembly", "semantic output"],
    [
      code(
        "templateBlockPair",
        "Canonical M1 executable semantic product-geometry proof.",
        "Static Records, Template specialization, exact body materialization, Expose, Interface, Mate, Fit, and tolerance assertion",
      ),
      html(
        "<h2>Definition and occurrence are separate</h2><p>Each Template specialization creates a reusable definition artifact. Assembly Part tags create occurrences with their own transforms and world semantics. Inspection retains the Template arguments and Record provenance rather than flattening the parts into anonymous solids.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/examples/plate-with-hole",
    "Examples",
    "Showcase: plate with a circular hole",
    "The canonical analysis fixture connects exact construction, named boundaries, Continuum lowering, native FEA, and an external verification deck.",
    ["plate with hole", "stress concentration", "FEA", "Abaqus"],
    [
      code(
        "plateWithHole",
        "Compile-tested M5 plate-with-hole benchmark source.",
        "A complete analysis workflow small enough to read",
      ),
      html(
        `<h2>Measured, not invented</h2><div class="metric-strip"><div><strong>${feaDisplacementMm.toFixed(6)} mm</strong><span>maximum displacement</span></div><div><strong>${feaVonMisesMpa.toFixed(3)} MPa</strong><span>maximum von Mises stress</span></div><div><strong>10,000 N</strong><span>applied resultant</span></div></div><p>Values are synchronized from <code>docs/fea/artifacts/m5/displacement-stress-summary.json</code>. The artifact packet includes AnalysisIR, native results, sparse-system metrics, residual history, stress/displacement summary, and <code>verification.inp</code>.</p><p>This benchmark is for current regression and architecture evidence. It is not a claim of commercial Abaqus execution or general nonlinear/contact capability.</p>`,
      ),
    ],
  ),
  page(
    "/aetheris/examples/imported-step",
    "Examples",
    "Showcase: imported STEP becomes semantic input",
    "Recognize a bounded region in exact imported CAD and use the normalized value in ordinary consumers.",
    ["imported STEP", "Recognize", "SemanticValue", "Replace"],
    [
      code(
        "inlineStep",
        "Canonical InlineStep → Recognize → SemanticValue → Replace proof.",
        "Existing exact CAD, evidence-backed region identity, and bounded downstream use",
      ),
      html(
        "<h2>The important seam</h2><p>Downstream code does not branch on “native versus imported.” It asks whether the semantic value has the capability and exact binding it needs. That same seam admits Selection and FEA where supported.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/cli",
    "Tools & reference",
    "CLI reference",
    "Current commands and flags, captured from the real Preview 2 CLI help rather than historical examples.",
    ["CLI", "build", "inspect", "mesh", "fea", "asm inspect"],
    [
      html(
        `<h2>Core commands</h2><div class="table-wrap"><table><thead><tr><th>Command</th><th>Purpose</th></tr></thead><tbody><tr><td><code>validate file.firmament</code></td><td>Parse, bind, and diagnose without materializing geometry.</td></tr><tr><td><code>build file.firmament [--output path] [--json]</code></td><td>Compile exact STEP AP242.</td></tr><tr><td><code>inspect file.firmament|file.step [--json]</code></td><td>Inspect Firmament semantics or route STEP to topology analysis.</td></tr><tr><td><code>mesh input [--format stl|obj] [--output path] [--debug-ir path] [--json]</code></td><td>Export supported exact BRep through SurfaceMeshIR.</td></tr><tr><td><code>fea analysis.firmament [--rotate x,y,z] [--out-dir dir] [--json]</code></td><td>Compile and solve supported linear elasticity; export verification artifacts.</td></tr><tr><td><code>asm inspect assembly.firmament|assembly.firmasm [--json] [--profile] [--out report.json]</code></td><td>Inspect product tree, Mates, placement authority, transforms, residuals, and tolerance results.</td></tr><tr><td><code>asm import-step source.step --out package [--json]</code></td><td>Preserve AP242 hierarchy or normalize ambiguous multiplicity into current <code>.firmasm</code> plus shared component STEP resources.</td></tr><tr><td><code>asm export-ap242 assembly.firmasm --out assembly.step [--json]</code></td><td>Lower bounded AssemblyIR hierarchy, occurrences, transforms, and definition reuse to native AP242 product structure.</td></tr></tbody></table></div><h2>Forge capability inspection</h2><p>There is no current top-level <code>aetheris forge</code> command. Capability metadata and invocation live in the Forge host/SDK and evidence tooling; this manual does not invent a CLI seam.</p><h2>Compatibility commands</h2><p><code>asm exec</code> and <code>asm export</code> retain the historical JSON-package workflow. The <code>.firmasm</code> extension itself is current; only its JSON-shaped syntax is legacy.</p>`,
      ),
    ],
  ),
  page(
    "/aetheris/cookbook",
    "Tools & reference",
    "Examples and cookbook",
    "Choose a complete, canonical fixture by the engineering job it demonstrates.",
    ["cookbook", "examples", "fixtures"],
    [
      html(
        `<div class="link-cards"><a href="/aetheris/examples/template-block-pair"><strong>Parameterized part → assembly</strong><span>Record, Template, Expose, Interface, Mate</span></a><a href="/aetheris/examples/bearing-module"><strong>Bearing module stackup</strong><span>Roles, Fits, Relations, worst-case tolerance</span></a><a href="/aetheris/examples/imported-step"><strong>Existing STEP workflow</strong><span>InlineStep, Recognize, Replace</span></a><a href="/aetheris/examples/plate-with-hole"><strong>Plate-with-hole analysis</strong><span>Semantic boundaries, Continuum, FEA, Abaqus deck</span></a><a href="/aetheris/geometry/surface-mesh-ir"><strong>Structured mesh export</strong><span>STEP/Firmament → SurfaceMeshIR → OBJ/STL</span></a><a href="/aetheris/forge/extension-sdk"><strong>Company-specific construction</strong><span>Forge descriptor, validation, exact output, semantics</span></a></div>`,
      ),
    ],
  ),
  page(
    "/aetheris/for-llms",
    "Tools & reference",
    "For LLMs and tool authors",
    "Generate against a typed, inspectable compiler contract and use exact diagnostics as the correction loop.",
    ["LLM", "agent", "language metadata", "diagnostics"],
    [
      html(
        `<h2>The useful proposition</h2><p>Aetheris is programmable at the same abstraction level models already understand: named engineering concepts, finite data tables, typed parameters, physical relationships, and assertions.</p><h2>Agent workflow</h2><ol><li>Read the <a href="/aetheris/reference/language">definitive language reference</a> and machine-synchronized <a href="/aetheris/reference/features">feature metadata</a>.</li><li>Author a small Firmament source and invoke <code>validate</code>.</li><li>Use exact diagnostic codes/spans to correct syntax, binding, or admissibility—not parser-source guesses.</li><li>Invoke reusable Templates through Forge.</li><li>When a genuinely missing local construction is required, implement a bounded Forge extension instead of emitting imaginary Firmament syntax or patching Kernel.Core.</li><li>Inspect semantic and output artifacts before composing a larger workflow.</li></ol><h2>Generation rules</h2><p>Do not equate parser acceptance with support. Do not invent flags. Do not address BRep topology IDs when a semantic path exists. Preserve Units and typed literals. Treat Experimental and Bounded as explicit contracts, not vague “beta” labels.</p>`,
      ),
    ],
  ),
  page(
    "/aetheris/architecture",
    "Tools & reference",
    "Platform architecture",
    "How Firmament, Forge, exact BRep, semantics, SurfaceMeshIR, Continuum, FEA, and AssemblyIR share a compiler substrate.",
    ["architecture", "AIR", "BRep", "CIR", "AssemblyIR"],
    [
      { kind: "architectureDiagram", variant: "platform" },
      html(
        "<h2>Authoring and host boundary</h2><p>Firmament binds typed source into compiler intent. Forge invokes Templates and contributes trusted extension outputs through validated contracts. Both feed the same semantic-value architecture.</p><h2>Geometry and analysis boundary</h2><p>Admitted construction lowers to exact BRep for boundary/topology and to CIR for occupied continuum. SurfaceMeshIR is a structured surface lane. AnalysisIR preserves semantic regions before Continuum and mechanics introduce cells, nodes, and degrees of freedom.</p><h2>Assembly boundary</h2><p>AssemblyIR holds the product tree, independent Mate graph, instance placements, world semantic bindings, residual freedoms, and dimensional transitions. Tolerance analysis is a compiler consumer of Dimensions, Fits, and Relations.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/vscode",
    "Tools & reference",
    "VS Code support",
    "Language configuration, grammar, snippets, and editor diagnostics for Firmament source.",
    ["VS Code", "extension", "syntax"],
    [
      html(
        `<p>The repository extension under <code>tools/vscode-firmament</code> provides Firmament language configuration, syntax grammar, snippets, and editor integration. The compiler remains authoritative; highlighting does not promote a construct to Supported status.</p><p><a href="https://github.com/yuechen-li-dev/Aetheris/tree/master/tools/vscode-firmament">Open the extension source →</a></p>`,
      ),
    ],
  ),
  page(
    "/aetheris/reference/diagnostics",
    "Tools & reference",
    "Reading diagnostics",
    "Treat diagnostics as typed compiler feedback about syntax, binding, capability, admissibility, lowering, or assertion failure.",
    ["diagnostics", "errors", "validation"],
    [
      html(
        "<h2>Fix the first causal error</h2><p>Run <code>aetheris validate file.firmament</code> before materialization. A diagnostic should identify the source span, stable code, and reason: unknown field, type mismatch, missing capability/exact binding, unsupported route, failed Require, or failed assertion.</p><h2>Unsupported is useful information</h2><p>An admissibility diagnostic means the requested topology/termination/representation is outside a bounded proven family. It is not an invitation to change spelling until the parser accepts something. Choose a supported strategy or implement a Forge extension.</p>",
      ),
    ],
  ),
  page(
    "/aetheris/reference/compatibility",
    "Tools & reference",
    "Compatibility and historical syntax",
    "Keep old fixtures readable without presenting their syntax or architecture as current Firmament V2.",
    ["Legacy", "Preview 1", "firmasm", "compatibility"],
    [
      html(
        "<h2>Current authority</h2><p>The definitive Firmament V2 reference and generated feature manifests override historical milestone notes. Legacy V1 TOON-style fixtures and alternate PMI spellings remain compatibility inputs. <code>.firmasm</code> is different: the extension is the current Firmament V2 Assembly document profile; only the historical JSON-shaped syntax is legacy.</p><h2>Stable public URLs</h2><p>Useful Preview 1 documentation URLs remain aliases to their Preview 2 replacement pages. Historical feature claims such as “assemblies future,” “FEA future,” or SDF-as-universal-authority framing have been removed from primary content.</p>",
      ),
    ],
  ),
];

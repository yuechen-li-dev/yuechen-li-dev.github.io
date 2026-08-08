import type { DocPage } from "./types";

const box = `Model BareBox {
    Units: mm
    Box Base { Size: [80mm, 50mm, 25mm] }
    Assert Volume Base {
        Expected: 100000mm^3
        Tolerance: 0mm^3
        Note: "Rectangular stock"
    }
}`;

const rectanglePath = `Model ConceptPathRectangle {
    Units: mm
    Concept Path Outline {
        Start: Point2(-10mm, -5mm)
        Heading: 0deg
        Line South { Length: 20mm }
        Line East { Turn: 90deg; Length: 10mm }
        Line North { Turn: 90deg; Length: 20mm }
        Close West
    }
    Profile Plate From Outline
    Struct Body { Extrude Plate { Profile: Plate; From: -2mm; To: 0mm } }
}`;

const lPath = `Concept Path Outline {
    Start: Point2(0mm, 0mm)
    Heading: 0deg
    Line South { Length: 40mm }
    Line East { Turn: 90deg; Length: 10mm }
    Line Inner { Turn: 90deg; Length: 30mm }
    Line Upright { Turn: -90deg; Length: 30mm }
    Line North { Turn: 90deg; Length: 10mm }
    Close West
}
Profile Bracket From Outline
Struct Body { Extrude Bracket { Profile: Bracket; From: 0mm; To: 8mm } }`;

const pattern = `Record MountSpec { Center: Point2 Diameter: Length }
Static Mounts: MountSpec[] = [
    MountSpec { Center: Point2(-30mm, -15mm) Diameter: 6mm }
    MountSpec { Center: Point2(30mm, -15mm) Diameter: 6mm }
    MountSpec { Center: Point2(30mm, 15mm) Diameter: 6mm }
    MountSpec { Center: Point2(-30mm, 15mm) Diameter: 6mm }
]
Require ValidDiameter => 6mm > 0mm
Template MountHole(MountSpec spec) {
    Hole<Shaft> Mount {
        On: +Z
        Center: spec.Center
        Diameter: spec.Diameter
        End: ThroughAll
    }
}
Box Plate { Size: [80mm, 50mm, 8mm] }
Modify Plate { Pattern MountPattern Over Mounts { MountHole(Current) } }`;

const pmi = `Box Base { Size: [80mm, 50mm, 12mm] }
Modify Base {
    Hole<Shaft> Mount {
        On: +Z
        Center: Point2(20mm, 20mm)
        Diameter: 8mm
        End: ThroughAll
    }
}
Require MountDiameterConstraint {
    Actual: Mount.Diameter
    Expected: 8mm
    Tolerance: PlusMinus(0.05mm, 0.02mm)
}
Pmi {
    Datum A { Target: face(+Z) }
    HoleDiameter MountDiameterCallout {
        From: MountDiameterConstraint
        As: HoleDiameter
        DatumRefs: [A]
    }
}`;

const code = (codeText: string, fixture: string, caption?: string) => ({
  type: "code" as const,
  code: codeText,
  fixture,
  caption,
});

export const DOC_PAGES: DocPage[] = [
  {
    route: "/aetheris/",
    group: "Introduction",
    title: "Exact CAD, written down",
    eyebrow: "Aetheris · Preview 1",
    description:
      "A public manual for Firmament V2: exact, semantic, code-first CAD that compiles to deterministic STEP AP242.",
    keywords: ["Aetheris", "Firmament", "exact CAD", "STEP AP242", "Preview 1"],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Aetheris turns Firmament source into exact boundary representation and canonical STEP AP242. It is not a macro recorder for a CAD GUI, and it will never ask which toolbar icon resembles a depressed bagel.</p><div class="callout"><strong>Preview 1, honestly.</strong> Exact primitives, bounded profiles and mechanical features, semantic requirements, PMI, verification, and a bounded existing-STEP workflow are here. Mesh fallback, arbitrary Boolean improvisation, automatic decompilation, and a general scripting language are not.</div><h2>What happens to the source?</h2><div class="pipeline"><span>Firmament source</span><b>→</b><span>semantic intent</span><b>→</b><span>normalized representation</span><b>→</b><span>exact B-rep</span><b>→</b><span>STEP AP242</span></div><p>A profile edge remains the edge declared by <code>Outline.South</code>; it is not replaced in the authoring model by whichever anonymous kernel edge received ID 436 on a damp Tuesday. Unsupported exact routes diagnose instead of quietly degrading to a mesh or generic NURBS patch.</p>`,
      },
      code(
        box,
        "fixtures/FirmamentV2/Canonical/valid/bare-box.firmament",
        "A complete exact solid, plus a source-level volume assertion.",
      ),
      {
        type: "figure",
        src: "/aetheris/assets/first-part.svg",
        alt: "Isometric technical illustration of an 80 by 50 by 25 millimetre box",
        caption:
          "The first part. Diagrammatic view; the fixture builds the authoritative STEP artifact.",
      },
      {
        type: "html",
        html: `<h2>Five useful minutes</h2><div class="cards"><a href="/aetheris/getting-started"><strong>Build your first part</strong><span>Use the real source workflow, then validate, build, view, and inspect.</span></a><a href="/aetheris/firmament/language-tour"><strong>Learn the mental model</strong><span>Units, declarations, source identity, and exactness.</span></a><a href="/aetheris/reference/support"><strong>Check the boundary</strong><span>The matrix comes from the frozen release manifest.</span></a><a href="/aetheris/for-llms"><strong>Give this to a model</strong><span>A compact canonical context without parser archaeology.</span></a></div>`,
      },
    ],
  },
  {
    route: "/aetheris/getting-started",
    group: "Introduction",
    title: "Getting started from source",
    description:
      "Install the actual Preview 1 development build and produce your first STEP file.",
    keywords: [
      "install",
      "source",
      "dotnet",
      "validate",
      "build",
      "inspect",
      "STEP",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Preview 1 does not yet have a released NuGet package. The honest installation path is a source checkout and the .NET SDK pinned by <code>global.json</code>. This section is isolated so the packaging milestone can replace it cleanly.</p><h2>Prerequisites and build</h2><pre class="terminal"><code>git clone https://github.com/yuechen-li-dev/Aetheris.git
cd Aetheris
dotnet restore Aetheris.slnx
dotnet build Aetheris.slnx -f net10.0 --no-restore /m:1
cd aetheris.client
npm install
npm run build
cd ..
dotnet build Aetheris.Server/Aetheris.Server.csproj -f net10.0 --no-restore /m:1
dotnet run --project Aetheris.CLI -- --help</code></pre><h2>Write one small thing</h2><p>Save this as <code>FirstPart.firmament</code>. It introduces exactly three facts: a model has millimetre units, a box has a size, and spelling matters.</p>`,
      },
      code(
        `Model FirstPart {
    Units: mm
    Box Body { Size: [80mm, 50mm, 10mm] }
}`,
        "fixtures/FirmamentV2/Canonical/valid/bare-box.firmament",
      ),
      {
        type: "html",
        html: `<h2>Five-minute loop</h2><pre class="terminal"><code>aetheris validate FirstPart.firmament
aetheris build FirstPart.firmament
aetheris view FirstPart.firmament
aetheris inspect FirstPart.firmament
aetheris verify FirstPart.firmament
aetheris analyze FirstPart.step --json</code></pre><p><code>validate</code> checks language and semantic intent without materializing geometry. <code>build</code> writes <code>FirstPart.step</code> beside the source; <code>view</code> builds Firmament if needed and opens the STEP in Cadmata; <code>inspect</code> reports source semantics; <code>analyze</code> reports STEP topology; and <code>verify</code> builds/reimports source for authoritative evidence.</p><p>Until P1-PACKAGE-M1 publishes the bundle, the one extra source-install step is building the Vite production bundle before the Cadmata host, as shown above. If <code>aetheris</code> is not installed on PATH, prefix the same arguments with <code>dotnet run --project Aetheris.CLI --</code>. No Vite development server or second terminal is required.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/vscode",
    group: "Introduction",
    title: "VS Code",
    description:
      "Edit Firmament as a first-class language with canonical highlighting and CLI-backed Problems.",
    keywords: [
      "VS Code",
      "VSIX",
      "extension",
      "Problems",
      "snippets",
      "validate on save",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Aetheris Firmament is the lightweight Preview 1 extension for <code>.firmament</code> files. It provides language recognition, canonical TextMate highlighting, comments and brackets, focused snippets, and commands backed by the real Aetheris CLI. It is not an LSP and does not duplicate the compiler.</p><h2>Install the development VSIX</h2><ol><li>Build or obtain <code>aetheris-firmament-0.1.0-preview.1.vsix</code>.</li><li>In VS Code run <strong>Extensions: Install from VSIX...</strong>.</li><li>Ensure <code>aetheris</code> is on PATH, or set <code>aetheris.executablePath</code> to the CLI executable.</li></ol><p>The extension has not been published to Marketplace.</p><h2>Editing and snippets</h2><p>Opening a <code>.firmament</code> file selects the Firmament language automatically. Snippets cover models, primitives, Concept Path/Profile, holes, slots, edge finishes, Require/PMI projection, volume assertions, and InlineStep. Highlighting improves readability; it does not prove that a geometry regime is supported.</p><h2>Commands and Problems</h2><dl><dt>Aetheris: Validate Firmament</dt><dd>Checks syntax and semantic intent without materializing geometry.</dd><dt>Aetheris: Build STEP</dt><dd>Runs the build stage, reports the adjacent STEP artifact, and can surface materialization-policy diagnostics.</dd><dt>Aetheris: View in Cadmata</dt><dd>Delegates build, Cadmata discovery, and launch to <code>aetheris view</code>.</dd><dt>Aetheris: Verify Model</dt><dd>Runs authoritative build/reimport verification.</dd></dl><p>Structured codes, severity, messages, and available source spans appear in VS Code Problems. Current Preview 1 CLI diagnostics do not all include source spans; those entries receive a minimal range rather than a guessed semantic location.</p><h2>Settings and trust</h2><dl><dt>aetheris.executablePath</dt><dd>Explicit CLI executable path. Empty means resolve <code>aetheris</code> from PATH.</dd><dt>aetheris.validateOnSave</dt><dd>Defaults on and validates only a saved Firmament file. No daemon starts on activation.</dd></dl><p>CLI commands and validate-on-save are disabled in untrusted workspaces because they execute a local compiler on workspace files.</p><h2>Current limits</h2><p>No completion, hover, semantic tokens, navigation, rename, formatting, embedded CAD view, project model, or background language service is included. Validate and build remain deliberately distinct; consult the frozen support matrix when build rejects unsupported geometry.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/why-aetheris",
    group: "Introduction",
    title: "Why Aetheris?",
    description:
      "The technical case for exact code-first CAD, semantic selection, and a bounded output contract.",
    keywords: ["design", "semantics", "source-bound", "exact geometry", "LLM"],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">A code-first CAD system is useful only if the code names engineering intent, not the incidental topology of one kernel run.</p><h2>Text is the editable artifact</h2><p>Firmament source diffs, reviews, templates, and validates like code. Humans and language models use the same declarations; there is no secret GUI transcript beneath them. Dimensions remain dimensions, holes remain holes, and a requirement can reach PMI without copying its number into a third ceremonial location.</p><h2>Source-bound selection</h2><p>Final B-rep edges are products of construction. Aetheris selects declared sources—profile segments, loops, holes, and slots—and carries provenance into exact construction. Some plausible operations are therefore unsupported; supported operations are explainable and deterministic.</p><h2>Bounded exactness</h2><p>Aetheris prefers admitted analytic families over automatic generic fallback. Planes, cylinders, cones, spheres, tori, and exact line/circle/arc curves survive into STEP. A self-intersecting blend diagnoses instead of applying a smoothing function and hoping manufacturing appreciates impressionism.</p><h2>Why AP242?</h2><p>STEP AP242 lets exact geometry and product semantics leave the compiler for downstream engineering systems. Preview 1 promises a deterministic bounded subset rather than universal interchange.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/firmament/language-tour",
    group: "Firmament V2",
    title: "Language tour",
    description:
      "The canonical model: units, values, declarations, intent, and source-grounded selection.",
    keywords: [
      "Model",
      "Units",
      "Point2",
      "Vector2",
      "Concept",
      "Struct",
      "Selection",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Firmament is a declarative language for constructive and semantic intent. It is not general control flow and not a command stream sent to a hidden GUI.</p><h2>Model and units</h2><p>Every canonical document begins with <code>Model Name { Units: mm }</code>. Millimetres are the only canonical length unit. Lengths carry <code>mm</code>, angles <code>deg</code>, volumes <code>mm^3</code>. Typed points use <code>Point2</code>/<code>Point3</code>; direction vectors use <code>Vector2</code>/<code>Vector3</code>. Primitive <code>Size</code> is the context-directed array exception.</p><h2>Material, scaffolding, semantics</h2><dl><dt>Material</dt><dd>Exact primitives and admitted Profile/Compose bodies become solids.</dd><dt>Scaffolding</dt><dd>Concepts, construction planes, paths, records, statics, and templates construct bounded intent.</dd><dt>Semantics</dt><dd>Selection, Require, Pmi, and Assert Volume bind expectations to results.</dd></dl><h2>Selections name causes</h2><p><code>ProfileSegments</code>, <code>ProfileLoop</code>, <code>Hole</code>, and <code>Slot</code> sources remain meaningful after topology changes. Never infer a B-rep edge number.</p>`,
      },
      {
        type: "matrix",
        headers: ["Value", "Canonical spelling", "Example"],
        rows: [
          ["Length", "number + mm", "8mm"],
          ["Angle", "number + deg", "90deg"],
          ["Volume", "number + mm^3", "100000mm^3"],
          ["2D point", "Point2(length, length)", "Point2(20mm, 10mm)"],
          ["Direction", "Vector2/Vector3(unitless…)", "Vector2(1, 0)"],
        ],
      },
      {
        type: "html",
        html: `<p>When no admitted exact route exists, compilation rejects the model. “Unsupported in Preview 1” is a result, not an invitation to invent a lowercase keyword and see whether the parser is feeling nostalgic.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/firmament/concept-path",
    group: "Firmament V2",
    title: "Concept Path: draw by describing motion",
    description:
      "Author connected line and tangent-arc profiles with local heading, turns, closure, and named identities.",
    keywords: [
      "Concept Path",
      "Start",
      "Heading",
      "Line",
      "Turn",
      "Arc",
      "Close",
      "End",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Concept Path lets an outline read like the path itself: begin here, face this way, travel, turn, and close. Manually tracking seven coordinate pairs is the sort of task computers were allegedly invented to prevent.</p><h2>Rectangle</h2><p><code>Start</code> is typed. Path <code>Heading</code> establishes local direction. A line continues it, uses relative <code>Turn</code>, or sets an absolute <code>Heading</code>. <code>Close West</code> emits the final named step.</p>`,
      },
      code(
        rectanglePath,
        "fixtures/FirmamentV2/Canonical/valid/concept-path-rectangle.firmament",
      ),
      {
        type: "figure",
        src: "/aetheris/assets/concept-path.svg",
        alt: "L-shaped concept path with named steps and a rounded corner",
        caption:
          "Path identities survive resolution: Outline.Start, Outline.South, and Outline.South.End.",
      },
      {
        type: "html",
        html: `<h2>An L-profile</h2><p>The negative turn at <code>Upright</code> creates the reflex corner. Once extruded, Top and Bottom mean local profile-frame faces, not permanent world Z.</p>`,
      },
      code(
        lPath,
        "fixtures/FirmamentV2/Canonical/valid/profile-chamfer-mixed-convex-reflex-loop-top.firmament",
      ),
      {
        type: "html",
        html: `<h2>One exact tangent arc</h2><p>An <code>Arc</code> continues tangent to its incoming step and changes heading by <code>Turn</code>. Radius and turn determine the exact circular segment. Named steps and <code>.End</code> identities remain authoring vocabulary.</p>`,
      },
      code(
        `Concept Path RoundedCorner {
    Start: Point2(0mm, 0mm)
    Heading: 0deg
    Line Base { Length: 40mm }
    Line Rise { Turn: 90deg; Length: 20mm }
    Arc OuterFillet { Radius: 10mm; Turn: 90deg }
    Line Top { Length: 30mm }
    Close Left
}`,
        "fixtures/FirmamentV2/Canonical/valid/concept-path-l-bracket-arc.firmament",
      ),
      {
        type: "html",
        html: `<h2>The low-level equivalent</h2><p><code>Profile Name From Path</code> is preferred. Explicit Segment/Trace authoring exposes segment identity for advanced loops; it is not a beginner tax.</p>`,
      },
      code(
        `Profile Plate {
    Loop Outer {
        Segment South { Trace: Outline.South; From: Outline.Start; To: Outline.South.End }
        Segment East { Trace: Outline.East; From: Outline.South.End; To: Outline.East.End }
        Segment North { Trace: Outline.North; From: Outline.East.End; To: Outline.North.End }
        Segment West { Trace: Outline.West; From: Outline.North.End; To: Outline.West.End }
    }
}`,
        "fixtures/FirmamentV2/Canonical/valid/concept-path-low-level-mixed.firmament",
      ),
      {
        type: "html",
        html: `<h2>Validity</h2><ul><li>Material profiles close explicitly.</li><li>Outer and inner loops use their required winding.</li><li>Zero-radius arcs, open profiles, and wrong winding diagnose.</li><li>Paths are scaffolding; Profile plus Extrude/Compose creates material.</li></ul>`,
      },
    ],
  },
  {
    route: "/aetheris/firmament/static-authoring",
    group: "Firmament V2",
    title: "Static data, templates, patterns, and Match",
    description:
      "Repeat semantic features through bounded compile-time expansion.",
    keywords: ["Record", "Static", "Template", "Pattern", "Match", "Require"],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Records, static arrays, one-parameter templates, and patterns expand deterministically before material lowering. They are a bounded convenience, not C# wearing a shorter coat.</p>`,
      },
      code(
        pattern,
        "fixtures/FirmamentV2/Canonical/valid/docs-four-hole-pattern.firmament",
        "Generated holes receive stable identities MountPattern_0, MountPattern_1, …",
      ),
      {
        type: "html",
        html: `<h2>Rules</h2><ul><li>Record declares typed fields; Static supplies compile-time values.</li><li>A template accepts one typed parameter.</li><li>Pattern invokes it with <code>Current</code> and emits bounded Hole or Slot features.</li><li>A generated Profile requires explicit identity and uses a direct indexed call such as <code>PlateProfile(Specs[0])</code>.</li><li>Duplicate names, order failures, unsupported output, and invalid comparisons diagnose.</li></ul><h2>Match is experimental</h2><p>Match supports bounded template-expansion arm selection only. It is not runtime branching.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/geometry/profiles-compose",
    group: "Geometry",
    title: "Profiles, local frames, and Compose",
    description:
      "Turn source-grounded 2D boundaries into exact prismatic bodies without losing semantic identity.",
    keywords: [
      "Profile",
      "Loop",
      "Segment",
      "Trace",
      "Compose",
      "Extrude",
      "local frame",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">A Profile is an authored boundary in a local 2D frame. Extrusion follows local +Z. This is innocuous until a plane rotates and “top” becomes a question with witnesses.</p><h2>Paths and low-level loops</h2><p>Prefer <code>Profile Bracket From Outline</code>. Low-level Outer/Inner loops expose named segments when a feature needs a source boundary. Segments reference named points or guide corners, not coordinate endpoints. Loops close with required winding.</p>`,
      },
      code(
        lPath,
        "fixtures/FirmamentV2/Canonical/valid/profile-compose-l-bracket.firmament",
      ),
      {
        type: "figure",
        src: "/aetheris/assets/l-bracket.svg",
        alt: "Extruded L-shaped profile with local top and bottom faces",
        caption:
          "An L-profile extruded in local +Z; source segments remain selectable.",
      },
      {
        type: "html",
        html: `<h2>Compose</h2><p>Compose materializes admitted prismatic stock and bounded cavities. A Base names Profile, From, To, and Role. It is not a general Boolean language and rejects cavity overlap or unadmitted hosts.</p><h2>Construction planes</h2><p><code>Construction Plane N { Trace: ConceptPlane }</code> freezes a frame. The hole route is narrow: simple Box, proper signed-permutation frame, Shaft, ThroughAll. Other hosts, orientations, extents, counterbores, and countersinks are unsupported.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/mechanical/holes",
    group: "Mechanical features",
    title: "Holes: shaft, counterbore, countersink",
    description:
      "Declare hole intent with exact fields and bounded host/end policies.",
    keywords: [
      "Hole",
      "Shaft",
      "Counterbore",
      "Countersink",
      "CounterboreDepth",
      "CountersinkAngle",
      "ThroughAll",
      "Blind",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">A Firmament hole is a semantic removal with named descendants, not an arbitrary cylinder subtracted from whatever overlaps it. This powers requirements, selections, PMI, and useful diagnostics.</p>`,
      },
      {
        type: "matrix",
        headers: [
          "Variant",
          "Required fields after On/From + Center",
          "Frozen route",
        ],
        rows: [
          [
            "Shaft",
            "Diameter, End",
            "ThroughAll; documented face-local blind/drill-point; bounded construction plane",
          ],
          [
            "Counterbore",
            "Diameter, CounterboreDiameter, CounterboreDepth, End",
            "Simple host and disjoint +Z Profile/Compose ThroughAll",
          ],
          [
            "Countersink",
            "Diameter, CountersinkDiameter, CountersinkAngle, End",
            "Admitted simple host",
          ],
        ],
      },
      {
        type: "html",
        html: `<h2>Shaft</h2><p><code>On</code> selects an entry face; <code>From</code> selects a construction plane. Center is local. ThroughAll is simplest. Do not invent <code>Hole&lt;Blind&gt;</code>: Blind is an End, not a variant.</p><h2>Counterbore</h2>`,
      },
      code(
        `Modify Base {
    Hole<Counterbore> Mount {
        On: +Z
        Center: Point2(0mm, 0mm)
        Diameter: 6mm
        CounterboreDiameter: 11mm
        CounterboreDepth: 4mm
        End: ThroughAll
    }
}`,
        "fixtures/FirmamentV2/Canonical/valid/counterbore-hole.firmament",
      ),
      {
        type: "figure",
        src: "/aetheris/assets/counterbore.svg",
        alt: "Counterbore section with shaft diameter, counterbore diameter, and depth",
        caption:
          "Two coaxial semantic regions; all dimensional fields are explicit.",
      },
      {
        type: "html",
        html: `<h2>Countersink</h2><p>Add <code>CountersinkDiameter</code> and dimensioned <code>CountersinkAngle</code>. Construction-plane counterbores/countersinks, touching cavities, non-prismatic hosts, and unlisted end/orientation combinations are intentionally unsupported.</p>`,
      },
      code(
        `Hole<Countersink> Mount {
    On: +Z
    Center: Point2(0mm, 0mm)
    Diameter: 6mm
    CountersinkDiameter: 12mm
    CountersinkAngle: 90deg
    End: ThroughAll
}`,
        "fixtures/FirmamentV2/Canonical/valid/countersink-hole.firmament",
      ),
    ],
  },
  {
    route: "/aetheris/mechanical/slots-patterns",
    group: "Mechanical features",
    title: "Slots and practical patterns",
    description:
      "Create Capsule and RoundedRectangle slots, then repeat semantic features from static data.",
    keywords: [
      "Slot",
      "Capsule",
      "RoundedRectangle",
      "CornerRadius",
      "Pattern",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Preview 1 supports Capsule and RoundedRectangle slots inside admitted Compose bodies. Both are through-all semantic removals.</p>`,
      },
      code(
        `Slot<Capsule> Relief {
    Center: Point2(0mm, 0mm)
    Direction: Vector2(1, 0)
    Length: 80mm
    Width: 40mm
    Extent: ThroughAll
    Role: ThroughSlot
}
Selection ReliefEntry { Target: SlotEntry Source: Slot(Relief) Require: ClosedLoop }`,
        "fixtures/FirmamentV2/Canonical/valid/semantic-slot-capsule.firmament",
      ),
      {
        type: "html",
        html: `<p>RoundedRectangle uses the same fields and additionally requires <code>CornerRadius</code>. No other slot family or extent is frozen. For bolt holes, put centers and diameters in a typed array, then Template and Pattern them; generated IDs are deterministic.</p>`,
      },
      code(
        pattern,
        "fixtures/FirmamentV2/Canonical/valid/docs-four-hole-pattern.firmament",
      ),
    ],
  },
  {
    route: "/aetheris/mechanical/edge-finishes",
    group: "Mechanical features",
    title: "Edge finishes without anonymous-edge roulette",
    description:
      "Source-bound chamfer and fillet support, exact families, compatibility topology, and intentional invalid regimes.",
    keywords: [
      "EdgeFinish",
      "Chamfer",
      "Fillet",
      "ExactRolling",
      "SphereSeamCompatibility",
      "ConvexSmall",
      "NURBS",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">EdgeFinish operates on declared source geometry: a profile segment, connected chain, or admitted loop. It does not inspect the final B-rep and guess which edge the author probably meant. This is why selections remain stable—and why unsupported topology is rejected instead of “best-efforted” into a different model.</p><h2>Chamfer</h2><p>Chamfer uses <code>Kind: Chamfer</code> and <code>Distance</code>. Frozen Profile support includes Top/Bottom straight segments, connected chains, convex/reflex junctions, rounded-source cases, and admitted mixed line/arc whole loops. Patches are exact planes or cones, including bounded cone apex. There is no NURBS fallback.</p>`,
      },
      code(
        `${lPath}
Modify Body {
    EdgeFinish MixedTopBreak {
        Target: Bracket.Outer
        On: Top
        Kind: Chamfer
        Distance: 1mm
    }
}`,
        "fixtures/FirmamentV2/Canonical/valid/profile-chamfer-mixed-convex-reflex-loop-top.firmament",
      ),
      {
        type: "figure",
        src: "/aetheris/assets/edge-finishes.svg",
        alt: "Comparison of a planar chamfer and cylindrical fillet",
        caption:
          "Two different constructions, both bound to a declared source edge.",
      },
      {
        type: "matrix",
        headers: ["Chamfer route", "Status", "Family / note"],
        rows: [
          ["Straight; convex/reflex junction", "Supported", "Plane"],
          ["Rounded convex/reflex source", "Bounded", "Plane/Cone"],
          ["Mixed line/arc whole loop", "Supported", "Plane/Cone shell"],
          ["Bounded cone apex", "Bounded", "Cone"],
          [
            "ConvexSmall: source radius < distance",
            "Invalid",
            "Collapsed inward offset",
          ],
          ["Generic NURBS fallback", "Unsupported", "Never substituted"],
        ],
      },
      {
        type: "html",
        html: `<h2>Fillet</h2><p>Frozen support is narrower: one finite straight outer edge, or two adjacent straight segments at a convex/reflex 90° junction, on local Top or Bottom. Use <code>Radius</code>; <code>EndClearance</code> defaults to Radius. Exact families are Cylinder, Sphere, and Torus. A sharp convex cylinder-cylinder junction uses a direct analytic miter seam.</p>`,
      },
      code(
        `${lPath}
Selection ReflexNotch {
    Source: Bracket.Outer.[Inner, Upright]
    Require: ConnectedChain
}
Modify Body {
    EdgeFinish ReflexRound {
        Target: ReflexNotch
        On: Top
        Kind: Fillet
        Radius: 2mm
        EndClearance: 3mm
    }
}`,
        "fixtures/FirmamentV2/Canonical/valid/profile-fillet-reflex-two-segment-top.firmament",
      ),
      {
        type: "html",
        html: `<h2>ExactRolling versus SphereSeamCompatibility</h2><p>These are geometry/topology policies, not STEP-writer switches. ExactRolling is the default reflex horn-torus rolling construction. SphereSeamCompatibility is an explicit opt-in with distinct sphere-seam topology for downstream importers that cannot retain the horn-torus seam. Both use the normal AP242 exporter and preserve source provenance; neither is universally “more correct.”</p>`,
      },
      {
        type: "matrix",
        headers: ["Fillet route", "Status", "Policy"],
        rows: [
          [
            "Single finite straight edge",
            "Supported",
            "Exact quarter-cylinder",
          ],
          ["Two-line convex 90°", "Supported", "Cylinder + analytic miter"],
          ["Two-line reflex 90°", "Supported", "ExactRolling default"],
          ["Sphere seam reflex", "Compatibility", "Explicit opt-in"],
          [
            "Rounded source / seven-station loop",
            "Experimental",
            "Mass verification not release-tight",
          ],
          ["ConvexSmall", "Invalid", "Spindle/self-intersection"],
          ["Arbitrary chains / generic fallback", "Unsupported", "Diagnose"],
        ],
      },
      {
        type: "html",
        html: `<div class="warning"><strong>Experimental means experimental.</strong> The mixed seven-station whole-loop fillet builds and reimports, but curved-trim volume verification carries a certified error bound of about 41,239 mm³. A successful artifact does not promote it. Reduce the request to a supported route or report the limitation.</div>`,
      },
    ],
  },
  {
    route: "/aetheris/semantics/require-pmi",
    group: "Semantics",
    title: "One number: Concept → Require → PMI",
    description:
      "Declare intent once, validate model semantics, then project the successful constraint into AP242 PMI.",
    keywords: [
      "Concept",
      "Static",
      "Require",
      "PMI",
      "From",
      "As",
      "DatumRefs",
      "HoleDiameter",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Concept/Static declares intent; Require validates selected intent against actual semantics; PMI explicitly projects a successful named requirement. The diameter should not be copied into geometry, validation, and a drawing callout as three numbers with independent opportunities for character development.</p><div class="pipeline"><span>Static value</span><b>→</b><span>Hole</span><b>→</b><span>named Require</span><b>→</b><span>SemanticConstraint</span><b>→</b><span>Pmi From / As</span></div>`,
      },
      code(
        pmi,
        "fixtures/FirmamentV2/Canonical/valid/pmi-projected-hole-diameter.firmament",
      ),
      {
        type: "figure",
        src: "/aetheris/assets/pmi.svg",
        alt: "Plate with through hole, datum A, and diameter tolerance",
        caption: "Datum and HoleDiameter are the current PMI kinds.",
      },
      {
        type: "html",
        html: `<h2>The projection fields</h2><dl><dt>From</dt><dd>The successful named Require.</dd><dt>As</dt><dd>Must be <code>HoleDiameter</code>.</dd><dt>DatumRefs</dt><dd>Defined datum labels such as <code>[A]</code>.</dd></dl><p>A projected declaration cannot override Target, Value, or Tolerance. Unknown/failed Requires, unknown datums, and overrides reject. When one Static value feeds Hole and Require, geometry, validation, and exported PMI change together.</p><div class="warning"><strong>Not in Preview 1:</strong> automatic Concept→PMI, export-all-Require, ontology inference, other PMI kinds, or a general GD&amp;T language.</div>`,
      },
    ],
  },
  {
    route: "/aetheris/verification",
    group: "Verification",
    title: "Assertions, inspection, analysis, and deterministic STEP",
    description:
      "Verify source intent against materialized/reimported B-rep and understand the curved-trim limit.",
    keywords: [
      "Assert Volume",
      "Expected",
      "Tolerance",
      "Note",
      "validate",
      "verify",
      "deterministic STEP",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede"><code>Assert Volume</code> is a source-level assertion. Build emits STEP, reimports that authoritative artifact, measures its B-rep, and evaluates the assertion. Assertion text does not alter STEP.</p>`,
      },
      code(
        `Assert Volume Base {
    Expected: 100000mm^3
    Tolerance: 0mm^3
    Note: "Rectangular stock"
}`,
        "fixtures/FirmamentV2/Canonical/valid/bare-box.firmament",
      ),
      {
        type: "html",
        html: `<dl><dt>Expected</dt><dd>Finite literal volume in mm^3.</dd><dt>Tolerance</dt><dd>Absolute, non-negative literal volume.</dd><dt>Note</dt><dd>Optional evidence metadata, not geometry.</dd></dl><h2>Which command knows what?</h2><ul><li><code>validate</code> checks language and semantic intent; it does not materialize every geometry policy.</li><li><code>build</code> plans/materializes exact geometry and is therefore where topology-policy errors such as ConvexSmall are reported.</li><li><code>inspect-profile</code>, <code>inspect-compose</code>, and <code>inspect-selections</code> expose normalized source semantics.</li><li><code>analyze</code> reads STEP topology/geometry and sequential IDs.</li><li><code>verify</code> reimports STEP and emits independent evidence.</li></ul><h2>Known limit</h2><p>Curved trimmed faces can carry a conservative deterministic error bound. The mixed whole-loop fillet's current bound is about 41,239 mm³, so it remains Experimental. Do not widen tolerance until red becomes aesthetically compatible with green.</p><h2>Determinism</h2><p>Fixed source/route emits canonical deterministic AP242 and advertised routes reimport/manifold-check. Exact surface families include Plane, Cylinder, Cone, Sphere, Torus, and bounded Hyperbola; curves are lines, circles, and arcs.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/existing-step",
    group: "Existing STEP",
    title: "Analyze, recognize, and replace bounded semantics",
    description:
      "Use sequential topology IDs to recognize a canonical STEP region and replace one shaft hole.",
    keywords: [
      "InlineStep",
      "Recognize",
      "Replace",
      "Faces",
      "Source.Face",
      "ADVANCED_FACE",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">This workflow labels and replaces one bounded recognized feature. It is not arbitrary reconstruction, magical decompilation, or a promise that a STEP file from a fax machine in 1997 contains recoverable intent.</p><h2>1. Analyze</h2><pre class="terminal"><code>aetheris analyze canonical-through-hole.step --json
aetheris analyze canonical-through-hole.step --face 7 --json</code></pre><h2>2. Inline, recognize, replace</h2>`,
      },
      code(
        `InlineStep Source {
    Path: "../../InlineStep/testdata/canonical-through-hole.step"
}
Recognize Source {
    Region MountHole {
        Kind: HoleShaft
        Confidence: High
        Faces: [7]
        Evidence: { SurfaceFamily: Cylindrical Radius: 1mm Through: true }
    }
}
Replace Source.MountHole With Hole<Shaft> MountHole {
    On: Source.Face(7)
    Center: Point2(0mm, 0mm)
    Diameter: 2mm
    End: ThroughAll
    HostSize: [10mm, 8mm, 6mm]
}`,
        "fixtures/FirmamentV2/Canonical/valid/inline-step-recognize-replace.firmament",
      ),
      {
        type: "html",
        html: `<h2>Two kinds of number</h2><p><code>Faces: [7]</code> and <code>Source.Face(7)</code> use sequential analysis IDs. Raw <code>ADVANCED_FACE #191</code> is traceability, not authoring vocabulary—roughly the difference between a building's tax-lot number and its third-floor conference room.</p><h2>Label without rebuilding</h2><p>Analyze and bounded recognition can label a canonical imported model without replacing it. Preview 1 can inspect those labels and use them for the admitted PMI/replacement route; it does not claim to persist arbitrary foreign feature history or every label through re-export.</p><h2>Boundary</h2><p>Preview 1 recognizes HoleShaft and DatumPlane. Replacement is verified ThroughAll Shaft with On, Center, Diameter, and HostSize. Input must be canonical Aetheris AP242; general foreign STEP and automatic recovery are unsupported.</p><h2>Appropriate difficulty</h2><p>Aetheris removes accidental complexity, not geometric complexity. A clean cylindrical through-hole should take an analysis ID and one recognition declaration. Reconstructing an ambiguous blend tree in malformed, spline-heavy STEP is genuinely hard; Preview 1 says so plainly instead of pretending it understood.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/cli",
    group: "CLI",
    title: "Command-line reference",
    description:
      "Validate, build, view, inspect, analyze, and verify with stable JSON output.",
    keywords: [
      "CLI",
      "validate",
      "build",
      "inspect-profile",
      "analyze",
      "verify",
      "JSON",
      "exit code",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">The CLI is both a human tool and the ground-truth inspection surface for automation. Add <code>--json</code> when another program—or a language model pretending not to be another program—consumes the result.</p>`,
      },
      {
        type: "matrix",
        headers: ["Command", "Input", "Purpose"],
        rows: [
          [
            "validate",
            ".firmament",
            "Check syntax, binding, dimensions, and static semantics",
          ],
          [
            "build",
            ".firmament",
            "Build adjacent .step; --output overrides the path",
          ],
          [
            "view",
            ".firmament / .step / .stp",
            "Build if needed, then open the STEP artifact",
          ],
          [
            "inspect",
            ".firmament / .step / .stp",
            "Show source semantics or STEP topology",
          ],
          [
            "analyze",
            ".step",
            "Inspect geometry/topology/maps/sections/volume",
          ],
          [
            "verify",
            ".firmament / .step / .stp",
            "Build source if needed, reimport, and verify",
          ],
        ],
      },
      {
        type: "html",
        html: `<pre class="terminal"><code>aetheris validate part.firmament
aetheris build part.firmament
aetheris inspect part.firmament --json
aetheris verify part.firmament
aetheris analyze part.step --face 7 --json
aetheris view part.firmament
aetheris view part.step</code></pre><h2>Defaults and exit behavior</h2><p><code>build</code> writes <code>part.step</code> beside <code>part.firmament</code> and deterministically replaces that generated artifact. Use <code>--output path.step</code> for another destination. <code>validate</code> does not materialize geometry; use <code>build</code> for geometry-policy diagnostics and STEP generation. Success is zero; command, validation, build, launch, and verification failures are non-zero. JSON keeps result fields and diagnostics on stdout without human prose.</p><h2>Cadmata launch</h2><p><code>view part.firmament</code> builds and opens its adjacent STEP; <code>view part.step</code> and <code>.stp</code> open directly without compilation. Aetheris hands Cadmata one normalized absolute path, checks that the process starts, and returns while the viewer remains open. Preview 1 starts a new Cadmata instance for every invocation.</p><p>Cadmata discovery checks <code>--cadmata-path</code>, <code>AETHERIS_CADMATA_PATH</code>, the compatibility <code>AETHERIS_CAD_ASSISTANT_PATH</code>, a sibling or package-relative <code>cadmata/Cadmata.exe</code>, PATH, and finally a source-development build. The legacy <code>--cad-assistant-path</code> flag remains accepted. Normal packaged use requires none of these overrides. Missing input, unsupported extensions, build failure, missing Cadmata, and process-launch failure are reported by the CLI; STEP import/display failure is shown inside Cadmata.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/cookbook",
    group: "Cookbook",
    title: "Cookbook: from plate to semantic replacement",
    description:
      "A compact index of task-shaped, compiler-proven Preview 1 examples.",
    keywords: [
      "mounting plate",
      "L-bracket",
      "pattern",
      "counterbore",
      "chamfer",
      "fillet",
      "PMI",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">These recipes point to executable fixtures, because a cookbook whose recipes have never encountered heat is merely speculative literature.</p><div class="recipe-list"><article><h2>Mounting plate</h2><p>Start with the first Box, then add Shaft. Fixture: <a href="https://github.com/yuechen-li-dev/Aetheris/blob/master/fixtures/FirmamentV2/Canonical/valid/box-through-hole.firmament">box-through-hole</a>.</p></article><article><h2>L-bracket</h2><p>Author a six-step Concept Path and extrude it. Fixture: <a href="https://github.com/yuechen-li-dev/Aetheris/blob/master/fixtures/FirmamentV2/Canonical/valid/profile-compose-l-bracket.firmament">profile-compose-l-bracket</a>.</p></article><article><h2>Patterned holes</h2><p>Record → Static → Template → Pattern. Fixture: <a href="https://github.com/yuechen-li-dev/Aetheris/blob/master/fixtures/FirmamentV2/Canonical/valid/record-array-pattern-holes.firmament">record-array-pattern-holes</a>.</p></article><article><h2>Counterbored plate</h2><p>Use all three dimensional fields. Fixture: <a href="https://github.com/yuechen-li-dev/Aetheris/blob/master/fixtures/FirmamentV2/Canonical/valid/counterbore-hole.firmament">counterbore-hole</a>.</p></article><article><h2>Chamfered profile</h2><p>Select declared source, never a kernel edge. Fixture: <a href="https://github.com/yuechen-li-dev/Aetheris/blob/master/fixtures/FirmamentV2/Canonical/valid/profile-chamfer-mixed-convex-reflex-loop-top.firmament">mixed-loop chamfer</a>.</p></article><article><h2>Bounded fillet</h2><p>Use one straight edge or a two-line junction. Fixture: <a href="https://github.com/yuechen-li-dev/Aetheris/blob/master/fixtures/FirmamentV2/Canonical/valid/profile-fillet-reflex-two-segment-top.firmament">reflex fillet</a>.</p></article><article><h2>PMI-protected hole</h2><p>Bind Require and project it. Fixture: <a href="https://github.com/yuechen-li-dev/Aetheris/blob/master/fixtures/FirmamentV2/Canonical/valid/pmi-projected-hole-diameter.firmament">projected PMI</a>.</p></article><article><h2>STEP replacement</h2><p>Analyze → InlineStep → Recognize → Replace. Fixture: <a href="https://github.com/yuechen-li-dev/Aetheris/blob/master/fixtures/FirmamentV2/Canonical/valid/inline-step-recognize-replace.firmament">semantic replacement</a>.</p></article></div>`,
      },
    ],
  },
  {
    route: "/aetheris/reference/language",
    group: "Reference",
    title: "Firmament V2 language reference",
    description: "Canonical declaration shapes and exact field spellings.",
    keywords: [
      "grammar",
      "fields",
      "CounterboreDepth",
      "CountersinkAngle",
      "DatumRefs",
      "End",
      "Heading",
      "Radius",
      "From",
      "As",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">This page is intentionally boring in the good way. Grammar X1 uses PascalCase declarations and fields.</p>`,
      },
      {
        type: "matrix",
        headers: ["Declaration", "Required canonical shape", "Status"],
        rows: [
          ["Model", "Name { Units: mm … }", "Supported"],
          ["Box", "Name { Size: [L,L,L] }", "Supported"],
          ["Cylinder", "Radius; Height", "Supported"],
          ["RoundedBox", "Size; CornerRadius", "Supported"],
          ["Frustum", "BottomRadius; TopRadius; Height", "Supported"],
          ["Concept Path", "Start; Heading; Line/Arc; Close", "Bounded"],
          ["Profile", "From Path OR Loop Outer/Inner + Segment", "Bounded"],
          ["Compose", "Base { Profile; From; To; Role }", "Bounded"],
          ["Selection", "Target; Source; Require", "Bounded"],
          ["Hole<Shaft>", "On|From; Center; Diameter; End", "Bounded"],
          [
            "Hole<Counterbore>",
            "… + CounterboreDiameter; CounterboreDepth",
            "Bounded",
          ],
          [
            "Hole<Countersink>",
            "… + CountersinkDiameter; CountersinkAngle",
            "Bounded",
          ],
          [
            "Slot<Capsule>",
            "Center; Direction; Length; Width; Extent",
            "Bounded",
          ],
          ["Slot<RoundedRectangle>", "… + CornerRadius", "Bounded"],
          ["EdgeFinish Chamfer", "Target; On; Kind; Distance", "Bounded"],
          [
            "EdgeFinish Fillet",
            "Target; On; Kind; Radius; EndClearance?; ReflexJunction?",
            "Bounded",
          ],
          ["Record / Static", "typed schema / compile-time value", "Bounded"],
          [
            "Template / Pattern",
            "one typed parameter / Over values",
            "Bounded",
          ],
          ["Require", "comparison OR Actual; Expected; Tolerance", "Bounded"],
          ["Assert Volume", "target { Expected; Tolerance; Note? }", "Bounded"],
          ["Pmi Datum", "Label { Target }", "Bounded"],
          ["Pmi HoleDiameter", "manual OR From; As; DatumRefs", "Bounded"],
          [
            "InlineStep / Recognize / Replace",
            "bounded forms in tutorial",
            "Bounded",
          ],
        ],
      },
      {
        type: "html",
        html: `<h2>Path entries</h2><dl><dt>Start</dt><dd>Point2(xmm, ymm).</dd><dt>Heading</dt><dd>Absolute angle in deg.</dd><dt>Line</dt><dd>Length plus optional relative Turn or absolute Heading.</dd><dt>Arc</dt><dd>Exact tangent arc with Radius and Sweep.</dd><dt>Close</dt><dd>Named final step to Start; explicit <code>To: Start</code> is also documented.</dd></dl><h2>Search spellings</h2><p><code>CounterboreDepth</code> · <code>CounterboreDiameter</code> · <code>CountersinkAngle</code> · <code>CountersinkDiameter</code> · <code>DatumRefs</code> · <code>ThroughAll</code> · <code>End</code> · <code>Heading</code> · <code>Radius</code> · <code>From</code> · <code>As</code>.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/reference/support",
    group: "Reference",
    title: "Preview 1 support matrix",
    description:
      "The public boundary rendered from the frozen capability snapshot.",
    keywords: [
      "Supported",
      "SupportedBounded",
      "Experimental",
      "Unsupported",
      "support matrix",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">This table is rendered from a committed, hash-tied snapshot of <code>artifacts/release/preview1-capabilities.json</code>. SupportedBounded means real support under explicit admission rules, never partial success plus generic fallback.</p><div data-capability-matrix></div><h2>Status vocabulary</h2><dl><dt>Supported</dt><dd>Frozen public route.</dd><dt>SupportedBounded</dt><dd>Frozen within explicit host/topology/orientation/end rules.</dd><dt>Experimental</dt><dd>Executable evidence exists; not promoted.</dd><dt>CompatibilityOnly</dt><dd>Accepted for migration, not new source.</dd><dt>Unsupported</dt><dd>No Preview 1 route; expect a diagnostic.</dd></dl><div class="warning"><strong>Release blocker:</strong> mixed whole-loop fillet remains Experimental until curved-trim mass verification is release-tight and the freeze changes.</div>`,
      },
    ],
  },
  {
    route: "/aetheris/reference/diagnostics",
    group: "Reference",
    title: "Reading diagnostics",
    description:
      "What the compiler knows, why it rejected the model, and the bounded change that can make it valid.",
    keywords: [
      "diagnostic",
      "unknown declaration",
      "missing field",
      "wrong dimension",
      "ConvexSmall",
      "unknown Datum",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">A useful diagnostic names the authoring fact that failed and the policy boundary involved. Many errors are exact field/dimension mistakes; others are intentional geometry limits.</p>`,
      },
      {
        type: "matrix",
        headers: ["Case", "Representative diagnostic", "Change"],
        rows: [
          [
            "Unknown Hole variant",
            "unknown Hole variant",
            "Use Shaft, Counterbore, Countersink",
          ],
          [
            "Missing field",
            "canonical-primitive/modify-malformed",
            "Add exact required field and dimension",
          ],
          ["Wrong point", "canonical-point2-invalid", "Use Point2(xmm, ymm)"],
          [
            "Construction-plane hole",
            "HoleConstructionPlane…Unsupported",
            "Box + signed-permutation + Shaft ThroughAll",
          ],
          [
            "ConvexSmall chamfer",
            "ProfileBoundaryChamferConvexArcRadiusTooSmall",
            "Reduce distance or increase source radius",
          ],
          [
            "ConvexSmall fillet",
            "ProfileBoundaryFilletConvexArcSpindleUnsupported",
            "Reduce radius or increase source radius",
          ],
          [
            "Unsupported EdgeFinish",
            "ProfileBoundaryFilletComposeUnsupported",
            "Use admitted Profile route",
          ],
          [
            "Failed Require",
            "Require validation gate",
            "Fix semantic mismatch",
          ],
          [
            "PMI override",
            "pmi-projected-field-must-not-override…",
            "Remove projected overrides",
          ],
          [
            "Unknown Require/Datum",
            "projection-unknown-require / unknown Datum",
            "Name earlier successful declarations",
          ],
        ],
      },
      {
        type: "html",
        html: `<h2>Intentional invalid regime</h2><p>When a convex source arc is smaller than the requested fillet, the locus is spindle-like and self-intersecting. The diagnostic means the compiler understood and rejected the exact policy. Do not invent <code>Fallback: NURBS</code>; no such field exists.</p><h2>Automation</h2><p>Run <code>validate … --json</code> for language/semantic checks, then <code>build … --json</code> to exercise materialization policy. Preserve identifier, location, and reason. Change documented fields or design intent; report unsupported policy instead of guessing grammar.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/reference/compatibility",
    group: "Reference",
    title: "Compatibility syntax is not canonical syntax",
    description:
      "Understand accepted legacy forms without teaching them as new V2 authoring.",
    keywords: [
      "compatibility",
      "legacy",
      "lowercase",
      "solid",
      "phase-style",
      "migration",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Accepted does not mean recommended. New source uses PascalCase, a Model root, typed points, and dimensioned literals.</p><h2>Retained input</h2><ul><li>lowercase model/PMI and phase-style source</li><li><code>solid</code> bindings and older face-local holes required by compatibility</li><li>bracket points and legacy PMI <code>Dimension</code></li><li>lowercase InlineStep/recognize/replace</li><li>Solid, Let, Fill, Manufacturing, Feature, and Expose in internal fixtures</li></ul><h2>Migration</h2><p>Validate old input, translate casing, replace bracket points with Point2/Point3, and compare built/verified output. Do not mix dialects in new examples.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/for-llms",
    group: "For LLMs",
    title: "Firmament quick context for frontier models",
    description:
      "A compact canonical contract designed to prevent hallucinated grammar and source archaeology.",
    keywords: [
      "LLM",
      "prompt",
      "grammar cheat sheet",
      "authoring rules",
      "error recovery",
    ],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Place this compact contract in context before requesting Preview 1 source. It favors exact names and negative rules over compiler internals. Approximate size: 850 words plus one task-specific example.</p><h2>Rules</h2><ol><li>Use <code>Model Name { Units: mm }</code>. Declarations and fields are PascalCase.</li><li>Lengths use mm, angles deg, volumes mm^3. Use typed Point2/Point3 and unitless Vector2/Vector3.</li><li>Never invent declarations, variants, or fields. Do not use lowercase compatibility syntax.</li><li>Prefer Concept Path for connected outlines, then Profile From Path.</li><li>Select source semantics. Never infer B-rep edge IDs. Imported STEP uses sequential analyzer face IDs, not ADVANCED_FACE entities.</li><li>Hole variants are exactly Shaft, Counterbore, Countersink. Blind is an End.</li><li>Chamfer support is broader. Supported Fillet is one straight edge or a two-line 90° junction. Whole-loop mixed Fillet is Experimental.</li><li>PMI is successful named Require → From + As: HoleDiameter + DatumRefs. Never override projected value/target/tolerance.</li><li>On unsupported policy, change the design or report the limit. Never invent Boolean, mesh, spline, or NURBS fallback.</li></ol><h2>Grammar cheat sheet</h2><pre class="cheat"><code>Model N { Units: mm … }
Box N { Size: [L,L,L] }
Cylinder N { Radius: L Height: L }
RoundedBox N { Size: [L,L,L] CornerRadius: L }
Frustum N { BottomRadius: L TopRadius: L Height: L }
Concept Path N { Start: Point2(L,L) Heading: A Line S { Length: L } … Close S }
Profile N From Path
Struct N { Extrude N { Profile: N From: L To: L } }
Selection N { Target: role Source: semantic-source Require: result-kind }
Modify Body { Hole&lt;Shaft&gt; N { On: +Z Center: Point2(L,L) Diameter: L End: ThroughAll } }
Counterbore adds CounterboreDiameter, CounterboreDepth
Countersink adds CountersinkDiameter, CountersinkAngle
EdgeFinish N { Target: source On: Top|Bottom Kind: Chamfer Distance: L }
EdgeFinish N { Target: source On: Top|Bottom Kind: Fillet Radius: L EndClearance: L? }
Record T { Field: Type } Static N: T[] = […] Template N(T x) { … }
Pattern N Over Values { Template(Current) }
Require N { Actual: semantic Expected: L Tolerance: PlusMinus(L,L) }
Assert Volume Body { Expected: V Tolerance: V Note: "…" }
Pmi { Datum A { Target: face(+Z) } HoleDiameter N { From: R As: HoleDiameter DatumRefs: [A] } }
InlineStep N { Path: "…" } Recognize N { Region … } Replace N.Region With Hole&lt;Shaft&gt; …</code></pre>`,
      },
      {
        type: "html",
        html: `<h2>VS Code</h2><p>The Aetheris Firmament extension recognizes <code>.firmament</code> files. Its Problems entries come from the real CLI, not an editor-side parser. Do not infer language or geometry support from syntax highlighting. When a build diagnostic reports an unsupported geometry regime, respect the frozen capability matrix rather than inventing syntax.</p><h2>See the result</h2><pre class="terminal"><code># Need to see Firmament?
aetheris view model.firmament

# Already have STEP?
aetheris view model.step</code></pre><p>Use the CLI. Do not manually start frontend servers, guess Cadmata ports, or search the repository for frontend launch scripts.</p><h2>Error recovery</h2><p>Run <code>aetheris validate file.firmament --json</code>, then build supported geometry to reach materialization-policy checks. For malformed declarations, consult field reference. For unsupported policy, narrow to the support matrix. Retry after a grammar correction. Never inspect parser source to guess syntax; report a documentation gap.</p><h2>Unsupported</h2><p>Runtime scripting; arbitrary Booleans; foreign STEP decompilation; automatic recovery; mesh/NURBS production fallback; general GD&amp;T; automatic PMI; construction-plane counterbores/countersinks; unlisted slots; broad fillet chains; mixed whole-loop fillet as Supported.</p>`,
      },
    ],
  },
  {
    route: "/aetheris/architecture",
    group: "Advanced",
    title: "The pipeline, one layer deeper",
    description:
      "Optional context for why source identity and exact policy appear in the language.",
    keywords: ["AST", "AIR", "B-rep", "STEP", "architecture", "CIR", "FRep"],
    blocks: [
      {
        type: "html",
        html: `<p class="lede">Using Firmament does not require compiler class names. This exists because engineers reasonably ask what happens between text and several thousand STEP parentheses.</p><div class="pipeline"><span>typed source</span><b>→</b><span>normalized semantics</span><b>→</b><span>AIR / intent</span><b>→</b><span>exact B-rep plan</span><b>→</b><span>AP242 + reimport evidence</span></div><h2>Normalization</h2><p>Compatibility input enters one semantic model. Static constructs expand deterministically; provenance and source identities survive.</p><h2>Constructive intent</h2><p>AIR describes admitted construction, not UI actions. Strategy choices record policy before export—for example ExactRolling versus SphereSeamCompatibility.</p><h2>Evidence</h2><p>STEP is reimported and measured, so assertions test what was emitted. CIR/FRep are internal evidence/mirroring concepts where relevant, not required vocabulary or another public modeling language.</p>`,
      },
    ],
  },
];

export const NAV_GROUPS = [
  "Introduction",
  "Firmament V2",
  "Geometry",
  "Mechanical features",
  "Semantics",
  "Verification",
  "Existing STEP",
  "CLI",
  "Cookbook",
  "Reference",
  "For LLMs",
  "Advanced",
] as const;

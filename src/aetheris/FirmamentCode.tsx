const keywords = new Set([
  "Model",
  "Units",
  "Box",
  "Cylinder",
  "RoundedBox",
  "Frustum",
  "Concept",
  "Struct",
  "Construction",
  "Plane",
  "Path",
  "Profile",
  "Compose",
  "Modify",
  "Hole",
  "Shaft",
  "Counterbore",
  "Countersink",
  "Slot",
  "Capsule",
  "RoundedRectangle",
  "EdgeFinish",
  "Selection",
  "Record",
  "Static",
  "Template",
  "Pattern",
  "Match",
  "Require",
  "Assert",
  "Volume",
  "Pmi",
  "Datum",
  "HoleDiameter",
  "InlineStep",
  "Recognize",
  "Replace",
  "With",
  "From",
  "Using",
  "On",
  "Over",
  "Line",
  "Arc",
  "Close",
  "Loop",
  "Outer",
  "Inner",
  "Segment",
  "Trace",
  "Base",
  "Extrude",
]);
const types = new Set([
  "Length",
  "Point2",
  "Point3",
  "Vector2",
  "Vector3",
  "Rect2",
  "ThroughAll",
  "Blind",
  "PlusMinus",
  "ExactRolling",
  "SphereSeamCompatibility",
]);
const fields = new Set([
  "Size",
  "Radius",
  "Height",
  "BottomRadius",
  "TopRadius",
  "CornerRadius",
  "Start",
  "Heading",
  "Turn",
  "Sweep",
  "Center",
  "Direction",
  "Length",
  "Width",
  "Extent",
  "Role",
  "Target",
  "Source",
  "Kind",
  "Distance",
  "EndClearance",
  "ReflexJunction",
  "Diameter",
  "End",
  "CounterboreDiameter",
  "CounterboreDepth",
  "CountersinkDiameter",
  "CountersinkAngle",
  "Expected",
  "Tolerance",
  "Note",
  "Actual",
  "From",
  "To",
  "As",
  "DatumRefs",
  "Path",
  "Confidence",
  "Faces",
  "Evidence",
  "SurfaceFamily",
  "Through",
  "HostSize",
]);

const tokenPattern =
  /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:mm\^3|mm|deg)\b|[A-Za-z_][A-Za-z0-9_]*|\s+|.)/g;

function tokenClass(token: string): string | undefined {
  if (token.startsWith("//")) return "tok-comment";
  if (token.startsWith('"')) return "tok-string";
  if (/^-?\d/.test(token) && /(mm\^3|mm|deg)$/.test(token))
    return "tok-dimension";
  if (keywords.has(token)) return "tok-keyword";
  if (types.has(token)) return "tok-type";
  if (fields.has(token)) return "tok-field";
  if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) return "tok-identifier";
  return undefined;
}

export function FirmamentCode({ source }: { source: string }) {
  const tokens = source.match(tokenPattern) ?? [];
  return (
    <code>
      {tokens.map((token, index) => {
        const className = tokenClass(token);
        return className ? (
          <span className={className} key={`${index}-${token}`}>
            {token}
          </span>
        ) : (
          token
        );
      })}
    </code>
  );
}

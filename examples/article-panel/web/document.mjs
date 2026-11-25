// The tutorial's view uses only Document, level-two Heading, and Paragraph.
function elementName(node) {
  if (node.tag === "Heading" && node.payload.level === "2") return "h2";
  if (node.tag === "Paragraph") return "p";
  throw new Error("Unsupported article-panel node " + node.tag);
}

export function renderDocument(events) {
  const fragment = document.createDocumentFragment();
  let current = fragment;
  for (const event of events) {
    if (event.tag === "Run") {
      current.append(document.createTextNode(event.payload.text));
      continue;
    }

    const node = event.payload.node;
    if (node.tag === "Document") continue;
    if (event.tag === "Open") {
      const element = document.createElement(elementName(node));
      current.append(element);
      current = element;
    } else {
      current = current.parentNode;
    }
  }
  return fragment;
}

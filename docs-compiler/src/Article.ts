import { Anchor, Escape, Link, RenderPage } from "./Portal";

export enum DocumentNode {
    Document,
    Heading(level: string),
    Paragraph,
    Strong,
    Emphasis,
    InlineCode,
    CodeBlock(language: string),
    Item,
    Quote,
    Callout,
    Link(target: string),
    List(kind: string),
    Break,
    ThematicBreak,
}

export enum DocumentPart {
    Open(node: DocumentNode, role: string),
    Close(node: DocumentNode),
    Run(text: string),
}

record Element {
    opening: string;
    closing: string;
    heading: string;
}

function HeadingId(label: string): string {
    let id = "";
    for (let index: int = 0; index < label.length; index = index + 1) {
        let code: int = String.CodeAt(label, index);
        if (code >= 65 && code <= 90) { code = code + 32; }
        const letter: boolean = code >= 97 && code <= 122;
        const digit: boolean = code >= 48 && code <= 57;
        if (letter || digit || code == 45 || code == 95 || code >= 128) {
            id = id + String.FromCode(code);
        } else if (code == 32 || code == 9) {
            id = id + "-";
        }
    }
    if (id == "") { return "section"; }
    return id;
}

function Decimal(value: int): string {
    let remaining: int = value;
    let result = "";
    while (remaining > 0) {
        result = String.FromCode(48 + remaining % 10) + result;
        remaining = remaining / 10;
    }
    return result;
}

function HeadingTag(level: string): string {
    if (level == "3" || level == "4" || level == "5" || level == "6") {
        return "h" + level;
    }
    return "h2";
}

function Pair(tag: string): Element {
    return { opening: "<" + tag + ">", closing: "</" + tag + ">", heading: "" };
}

function IsSafeLink(target: string): boolean {
    if (String.IndexOf(target, String.FromCode(92)) >= 0
        || String.IndexOf(target, String.FromCode(10)) >= 0
        || String.IndexOf(target, String.FromCode(13)) >= 0
        || String.IndexOf(target, String.FromCode(9)) >= 0
        || String.IndexOf(target, "//") == 0) {
        return false;
    }
    return String.IndexOf(target, "/") == 0 || String.IndexOf(target, "#") == 0
        || String.IndexOf(target, "https://") == 0 || String.IndexOf(target, "http://") == 0
        || String.IndexOf(target, "mailto:") == 0;
}

function LinkElement(target: string): Element ! string {
    if (!IsSafeLink(target)) { return err("Unsupported documentation link: " + target); }
    return ok({ opening: '<a href="' + Escape(target) + '">', closing: "</a>", heading: "" });
}

function ListElement(kind: string): Element {
    if (kind == "Ordered") { return Pair("ol"); }
    return Pair("ul");
}

function Markup(node: DocumentNode): Element ! string {
    return match node {
        Document => ok({ opening: "", closing: "", heading: "" }),
        Heading(level) => ok({ opening: "", closing: "</" + HeadingTag(level) + ">", heading: HeadingTag(level) }),
        Paragraph => ok(Pair("p")),
        Strong => ok(Pair("strong")),
        Emphasis => ok(Pair("em")),
        InlineCode => ok(Pair("code")),
        CodeBlock(language) => ok({ opening: '<pre><code data-language="' + Escape(language) + '">', closing: "</code></pre>", heading: "" }),
        Item => ok(Pair("li")),
        Quote => ok(Pair("blockquote")),
        Callout => ok({ opening: '<aside class="callout">', closing: "</aside>", heading: "" }),
        Link(target) => LinkElement(target),
        List(kind) => ok(ListElement(kind)),
        Break => ok({ opening: "<hr>", closing: "", heading: "" }),
        ThematicBreak => ok({ opening: "<hr>", closing: "", heading: "" }),
    };
}

function HeadingLabel(parts: DocumentPart[], start: int): string ! string {
    let label = "";
    for (let index: int = start; index < parts.length; index = index + 1) {
        const part: DocumentPart = parts[index];
        match part {
            case Run(text) => { label = label + text; }
            case Close(node) => {
                const element: Element = Markup(node)?;
                if (element.heading != "") { return ok(label); }
            }
            case Open(node, role) => {}
        }
    }
    return err("A heading has no closing event.");
}

export function RenderDocument(title: string, description: string, canonical: string,
    project: Link, navigation: Link[], parts: DocumentPart[], source: string): string ! string {
    let html = "";
    let headings = "";
    const anchors = MutableList<string>();
    anchors.append("content");
    for (let index: int = 0; index < parts.length; index = index + 1) {
        const part: DocumentPart = parts[index];
        match part {
            case Run(text) => { html = html + Escape(text); }
            case Close(node) => {
                const element: Element = Markup(node)?;
                html = html + element.closing;
            }
            case Open(node, role) => {
                const element: Element = Markup(node)?;
                if (element.heading == "") {
                    html = html + element.opening;
                } else {
                    const label: string = HeadingLabel(parts, index + 1)?;
                    const base: string = HeadingId(label);
                    let id: string = base;
                    let suffix: int = 1;
                    for (let prior: int = 0; prior < anchors.length; prior = prior + 1) {
                        if (anchors[prior] == id) {
                            id = base + "-" + Decimal(suffix);
                            suffix = suffix + 1;
                            prior = -1;
                        }
                    }
                    anchors.append(id);
                    html = html + "<" + element.heading + ' id="' + Escape(id) + '">';
                    headings = headings + "<li>" + Anchor("#" + id, label) + "</li>";
                }
            }
        }
    }
    let outline = "";
    if (headings != "") {
        outline = '<nav class="outline" aria-label="On this page"><p>On this page</p><ul>' + headings + "</ul></nav>";
    }
    return ok(RenderPage(title, description, canonical, project, navigation, html, outline, source));
}

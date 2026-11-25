export enum Size {
    Zero,
    Auto,
    Px(value: float),
    Rem(value: float),
    Em(value: float),
    Percent(value: float),
    ViewHeight(value: float),
    FluidRem(minimum: float, viewportWidth: float, maximum: float),
}

export enum Spacing {
    All(value: Size),
    Axes(vertical: Size, horizontal: Size),
    Sides(top: Size, right: Size, bottom: Size, left: Size),
}

export enum Color {
    Rgb(red: int, green: int, blue: int),
    Inherit,
    AccentToken,
    LineToken,
}

export enum Border {
    None,
    Solid(width: Size, color: Color),
}

export enum Track {
    Fixed(size: Size),
    Flexible(fraction: int),
    AutoFit(minimum: Size),
}

export enum Display { Block, Flex, Grid }
export enum Position { Absolute, Static, Sticky }
export enum Font { Interface, Code }
export enum Wrap { Normal, Anywhere }
export enum State { Rest, Hover, Focus, FocusVisible, CurrentPage }

export enum Declaration {
    FontFamily(font: Font),
    ColorOf(color: Color),
    Background(color: Color),
    SiteColorSchemes,
    Accent(color: Color),
    Line(color: Color),
    LineHeight(value: float),
    FontSize(size: Size),
    FontWeight(value: int),
    LetterSpacing(size: Size),
    BorderBox,
    Margin(value: Spacing),
    MarginTop(size: Size),
    MarginBottom(size: Size),
    Padding(value: Spacing),
    PaddingTop(size: Size),
    PaddingRight(size: Size),
    PaddingBottom(size: Size),
    Top(size: Size),
    Left(size: Size),
    MaxWidth(size: Size),
    MinHeight(size: Size),
    Layer(value: int),
    DisplayAs(value: Display),
    Positioned(value: Position),
    JustifyBetween,
    AlignCenter,
    AlignStart,
    Gap(size: Size),
    Columns(tracks: Track[]),
    Column(value: int),
    Row(value: int),
    AutoRow,
    ListUnmarked,
    DecorationNone,
    UnderlineOffset(size: Size),
    Outline(border: Border),
    OutlineOffset(size: Size),
    AllBorders(border: Border),
    BorderTop(border: Border),
    BorderRight(border: Border),
    BorderBottom(border: Border),
    BorderLeft(border: Border),
    Radius(size: Size),
    OverflowAuto,
    HorizontalOverflowAuto,
    WrapAs(value: Wrap),
    ScrollMarginTop(size: Size),
    CollapseBorders,
    CenterText,
}

export enum Tag {
    Body, Link, List, Item, Paragraph, Main, Nav, Article,
    Heading1, Heading2, Heading3, Pre, Code, Image, Table, Th, Td,
}

export enum Part {
    Skip, Header, HeaderInner, Brand, Home, Intro, ProjectGrid,
    DocsShell, ProjectTitle, Outline, Callout, Provenance, Footer,
    SyntaxKeyword, SyntaxType, SyntaxFunction, SyntaxString, SyntaxLiteral, SyntaxComment,
}

export enum Selector {
    Root,
    Universal,
    Element(tag: Tag),
    Class(part: Part),
}

export record Target {
    path: Selector[];
    state: State;
}

export record Rule {
    targets: Target[];
    declarations: Declaration[];
}

export enum Section {
    Base(rules: Rule[]),
    MaxWidthRem(width: int, rules: Rule[]),
    DarkPreference(rules: Rule[]),
}

function FormatSize(size: Size): string {
    return match size {
        Zero => "0",
        Auto => "auto",
        Px(value) => `${value}px`,
        Rem(value) => `${value}rem`,
        Em(value) => `${value}em`,
        Percent(value) => `${value}%`,
        ViewHeight(value) => `${value}vh`,
        FluidRem(minimum, viewportWidth, maximum) => `clamp(${minimum}rem, ${viewportWidth}vw, ${maximum}rem)`,
    };
}

function FormatSpacing(spacing: Spacing): string {
    return match spacing {
        All(value) => FormatSize(value),
        Axes(vertical, horizontal) => FormatSize(vertical) + " " + FormatSize(horizontal),
        Sides(top, right, bottom, left) =>
            FormatSize(top) + " " + FormatSize(right) + " " + FormatSize(bottom) + " " + FormatSize(left),
    };
}

function FormatColor(color: Color): string {
    return match color {
        Rgb(red, green, blue) => `rgb(${red}, ${green}, ${blue})`,
        Inherit => "inherit",
        AccentToken => "var(--accent)",
        LineToken => "var(--line)",
    };
}

function FormatBorder(border: Border): string {
    return match border {
        None => "0",
        Solid(width, color) => FormatSize(width) + " solid " + FormatColor(color),
    };
}

function FormatTracks(tracks: Track[]): string {
    const formatted = MutableList<string>();
    for (let index: int = 0; index < tracks.length; index = index + 1) {
        const track: Track = tracks[index];
        const text: string = match track {
            Fixed(size) => FormatSize(size),
            Flexible(fraction) => `minmax(0, ${fraction}fr)`,
            AutoFit(minimum) => "repeat(auto-fit, minmax(min(100%, " + FormatSize(minimum) + "), 1fr))",
        };
        formatted.append(text);
    }
    return String.Join(formatted.freeze(), " ");
}

function FormatDeclaration(value: Declaration): string {
    return match value {
        FontFamily(font) => "font-family: " + (match font {
            Interface => '"Segoe UI", system-ui, sans-serif',
            Code => 'Consolas, "Liberation Mono", monospace',
        }),
        ColorOf(color) => "color: " + FormatColor(color),
        Background(color) => "background: " + FormatColor(color),
        SiteColorSchemes => "color-scheme: light dark",
        Accent(color) => "--accent: " + FormatColor(color),
        Line(color) => "--line: " + FormatColor(color),
        LineHeight(ratio) => `line-height: ${ratio}`,
        FontSize(size) => "font-size: " + FormatSize(size),
        FontWeight(weight) => `font-weight: ${weight}`,
        LetterSpacing(size) => "letter-spacing: " + FormatSize(size),
        BorderBox => "box-sizing: border-box",
        Margin(spacing) => "margin: " + FormatSpacing(spacing),
        MarginTop(size) => "margin-top: " + FormatSize(size),
        MarginBottom(size) => "margin-bottom: " + FormatSize(size),
        Padding(spacing) => "padding: " + FormatSpacing(spacing),
        PaddingTop(size) => "padding-top: " + FormatSize(size),
        PaddingRight(size) => "padding-right: " + FormatSize(size),
        PaddingBottom(size) => "padding-bottom: " + FormatSize(size),
        Top(size) => "top: " + FormatSize(size),
        Left(size) => "left: " + FormatSize(size),
        MaxWidth(size) => "max-width: " + FormatSize(size),
        MinHeight(size) => "min-height: " + FormatSize(size),
        Layer(layer) => `z-index: ${layer}`,
        DisplayAs(display) => "display: " + (match display { Block => "block", Flex => "flex", Grid => "grid" }),
        Positioned(position) => "position: " + (match position { Absolute => "absolute", Static => "static", Sticky => "sticky" }),
        JustifyBetween => "justify-content: space-between",
        AlignCenter => "align-items: center",
        AlignStart => "align-items: start",
        Gap(size) => "gap: " + FormatSize(size),
        Columns(tracks) => "grid-template-columns: " + FormatTracks(tracks),
        Column(index) => `grid-column: ${index}`,
        Row(index) => `grid-row: ${index}`,
        AutoRow => "grid-row: auto",
        ListUnmarked => "list-style: none",
        DecorationNone => "text-decoration: none",
        UnderlineOffset(size) => "text-underline-offset: " + FormatSize(size),
        Outline(border) => "outline: " + FormatBorder(border),
        OutlineOffset(size) => "outline-offset: " + FormatSize(size),
        AllBorders(border) => "border: " + FormatBorder(border),
        BorderTop(border) => "border-top: " + FormatBorder(border),
        BorderRight(border) => "border-right: " + FormatBorder(border),
        BorderBottom(border) => "border-bottom: " + FormatBorder(border),
        BorderLeft(border) => "border-left: " + FormatBorder(border),
        Radius(size) => "border-radius: " + FormatSize(size),
        OverflowAuto => "overflow: auto",
        HorizontalOverflowAuto => "overflow-x: auto",
        WrapAs(wrap) => "overflow-wrap: " + (match wrap { Normal => "normal", Anywhere => "anywhere" }),
        ScrollMarginTop(size) => "scroll-margin-top: " + FormatSize(size),
        CollapseBorders => "border-collapse: collapse",
        CenterText => "text-align: center",
    };
}

function FormatTag(tag: Tag): string {
    return match tag {
        Body => "body", Link => "a", List => "ul", Item => "li", Paragraph => "p",
        Main => "main", Nav => "nav", Article => "article",
        Heading1 => "h1", Heading2 => "h2", Heading3 => "h3",
        Pre => "pre", Code => "code", Image => "img", Table => "table", Th => "th", Td => "td",
    };
}

function ClassName(part: Part): string {
    return match part {
        Skip => "skip", Header => "site-header", HeaderInner => "header-inner", Brand => "brand",
        Home => "home", Intro => "intro", ProjectGrid => "project-grid", DocsShell => "docs-layout",
        ProjectTitle => "project-title", Outline => "outline", Callout => "callout",
        Provenance => "provenance", Footer => "site-footer",
        SyntaxKeyword => "syntax-keyword", SyntaxType => "syntax-type", SyntaxFunction => "syntax-function",
        SyntaxString => "syntax-string", SyntaxLiteral => "syntax-literal", SyntaxComment => "syntax-comment",
    };
}

export function ClassAttribute(part: Part): string {
    return ' class="' + ClassName(part) + '"';
}

function FormatTarget(target: Target): string {
    const selectors = MutableList<string>();
    for (let index: int = 0; index < target.path.length; index = index + 1) {
        const selector: Selector = target.path[index];
        const token: string = match selector {
            Root => ":root",
            Universal => "*",
            Element(tag) => FormatTag(tag),
            Class(part) => "." + ClassName(part),
        };
        selectors.append(token);
    }
    const suffix: string = match target.state {
        Rest => "",
        Hover => ":hover",
        Focus => ":focus",
        FocusVisible => ":focus-visible",
        CurrentPage => '[aria-current="page"]',
    };
    return String.Join(selectors.freeze(), " ") + suffix;
}

function FormatRules(rules: Rule[], indent: string): string {
    const lines = MutableList<string>();
    for (let index: int = 0; index < rules.length; index = index + 1) {
        const rule: Rule = rules[index];
        const targets = MutableList<string>();
        for (let target: int = 0; target < rule.targets.length; target = target + 1) {
            targets.append(FormatTarget(rule.targets[target]));
        }
        lines.append(indent + String.Join(targets.freeze(), ", ") + " {");
        for (let item: int = 0; item < rule.declarations.length; item = item + 1) {
            lines.append(indent + "  " + FormatDeclaration(rule.declarations[item]) + ";");
        }
        lines.append(indent + "}");
    }
    return String.Join(lines.freeze(), String.FromCode(10));
}

export function FormatStyleSheet(sections: Section[]): string {
    const newline = String.FromCode(10);
    const output = MutableList<string>();
    for (let index: int = 0; index < sections.length; index = index + 1) {
        const section: Section = sections[index];
        const css: string = match section {
            Base(rules) => FormatRules(rules, ""),
            MaxWidthRem(width, rules) => `@media (max-width: ${width}rem) {` + newline
                + FormatRules(rules, "  ") + newline + "}",
            DarkPreference(rules) => "@media (prefers-color-scheme: dark) {" + newline
                + FormatRules(rules, "  ") + newline + "}",
        };
        output.append(css);
    }
    return String.Join(output.freeze(), newline + newline) + newline;
}

import {
    Border, Color, Declaration, Display, Font, FormatStyleSheet, Part,
    Position, Rule, Section, Selector, Size, Spacing, State, Tag, Target, Track, Wrap,
} from "./StyleSheet";

record SyntaxPalette {
    keyword: Color;
    typeName: Color;
    functionName: Color;
    stringValue: Color;
    literal: Color;
    comment: Color;
}

record Palette {
    ink: Color;
    paper: Color;
    muted: Color;
    accent: Color;
    line: Color;
    linkHover: Color;
    focus: Color;
    header: Color;
    headerLink: Color;
    surface: Color;
    code: Color;
    syntax: SyntaxPalette;
}

record CalloutStyle {
    background: Color;
    accent: Color;
    inset: Spacing;
    margin: Spacing;
}

record DocsGrid {
    columns: Track[];
    gap: Size;
}

record Theme {
    palette: Palette;
    callout: CalloutStyle;
    maxPageWidth: Size;
    horizontalInset: Size;
    verticalInset: Size;
    docsGrid: DocsGrid;
    tabletBreakpoint: int;
    phoneBreakpoint: int;
}

function DefaultTheme(): Theme {
    return {
        palette: {
            ink: Color.Rgb(23, 38, 56),
            paper: Color.Rgb(247, 249, 252),
            muted: Color.Rgb(75, 93, 112),
            accent: Color.Rgb(19, 91, 130),
            line: Color.Rgb(214, 224, 233),
            linkHover: Color.Rgb(11, 64, 93),
            focus: Color.Rgb(37, 123, 172),
            header: Color.Rgb(21, 43, 61),
            headerLink: Color.Rgb(228, 240, 246),
            surface: Color.Rgb(255, 255, 255),
            code: Color.Rgb(234, 240, 246),
            syntax: {
                keyword: Color.Rgb(111, 43, 147),
                typeName: Color.Rgb(0, 92, 97),
                functionName: Color.Rgb(29, 72, 150),
                stringValue: Color.Rgb(33, 105, 63),
                literal: Color.Rgb(128, 64, 16),
                comment: Color.Rgb(79, 98, 117),
            },
        },
        callout: {
            background: Color.Rgb(231, 242, 248),
            accent: Color.Rgb(47, 120, 155),
            inset: Spacing.Axes(Size.Rem(0.85), Size.Rem(1.1)),
            margin: Spacing.Axes(Size.Rem(1.5), Size.Zero),
        },
        maxPageWidth: Size.Rem(76.0),
        horizontalInset: Size.FluidRem(1.25, 5.0, 3.0),
        verticalInset: Size.FluidRem(1.5, 6.0, 5.0),
        docsGrid: {
            columns: [Track.Fixed(Size.Rem(12.0)), Track.Flexible(1), Track.Fixed(Size.Rem(12.0))],
            gap: Size.FluidRem(1.5, 4.0, 3.0),
        },
        tabletBreakpoint: 63,
        phoneBreakpoint: 44,
    };
}

function DarkTheme(theme: Theme): Theme {
    return theme with {
        palette: {
            ink: Color.Rgb(221, 231, 243),
            paper: Color.Rgb(16, 23, 33),
            muted: Color.Rgb(160, 177, 198),
            accent: Color.Rgb(136, 197, 255),
            line: Color.Rgb(51, 69, 90),
            linkHover: Color.Rgb(180, 220, 255),
            focus: Color.Rgb(123, 198, 255),
            header: Color.Rgb(13, 20, 30),
            headerLink: Color.Rgb(213, 232, 249),
            surface: Color.Rgb(23, 34, 48),
            code: Color.Rgb(24, 33, 47),
            syntax: {
                keyword: Color.Rgb(221, 172, 255),
                typeName: Color.Rgb(126, 221, 211),
                functionName: Color.Rgb(150, 194, 255),
                stringValue: Color.Rgb(156, 222, 165),
                literal: Color.Rgb(251, 194, 132),
                comment: Color.Rgb(155, 173, 198),
            },
        },
        callout: theme.callout with {
            background: Color.Rgb(26, 43, 58),
            accent: Color.Rgb(86, 155, 194),
        },
    };
}

function PartTarget(part: Part): Target {
    return { path: [Selector.Class(part)], state: State.Rest };
}

function ElementTarget(tag: Tag): Target {
    return { path: [Selector.Element(tag)], state: State.Rest };
}

function Scope(path: Selector[]): Target {
    return { path: path, state: State.Rest };
}

function On(target: Target, declarations: Declaration[]): Rule {
    return { targets: [target], declarations: declarations };
}

function Shared(targets: Target[], declarations: Declaration[]): Rule {
    return { targets: targets, declarations: declarations };
}

function DocsGridRule(grid: DocsGrid): Rule {
    return On(PartTarget(Part.DocsShell), [
        Declaration.DisplayAs(Display.Grid), Declaration.Columns(grid.columns),
        Declaration.Gap(grid.gap), Declaration.AlignStart,
    ]);
}

function CalloutRule(style: CalloutStyle): Rule {
    return On(Scope([Selector.Element(Tag.Article), Selector.Class(Part.Callout)]), [
        Declaration.Padding(style.inset),
        Declaration.Margin(style.margin),
    ]);
}

function PaletteRules(theme: Theme): Rule[] {
    const palette: Palette = theme.palette;
    const syntax: SyntaxPalette = palette.syntax;
    const article = Selector.Element(Tag.Article);
    const link = ElementTarget(Tag.Link);

    return [
        On(Scope([Selector.Root]), [
            Declaration.ColorOf(palette.ink), Declaration.Background(palette.paper),
            Declaration.Accent(palette.accent), Declaration.Line(palette.line),
        ]),
        On(link with { state: State.Hover }, [Declaration.ColorOf(palette.linkHover)]),
        On(link with { state: State.FocusVisible }, [Declaration.Outline(Border.Solid(Size.Px(2.0), palette.focus))]),
        On(PartTarget(Part.Skip), [Declaration.Background(palette.surface)]),
        On(PartTarget(Part.Header), [Declaration.Background(palette.header), Declaration.ColorOf(palette.headerLink)]),
        On(Scope([Selector.Class(Part.Header), Selector.Element(Tag.Link)]), [Declaration.ColorOf(palette.headerLink)]),
        On(Scope([Selector.Class(Part.ProjectGrid), Selector.Element(Tag.Item)]), [Declaration.Background(palette.surface)]),
        Shared([
            PartTarget(Part.Intro), PartTarget(Part.Provenance), PartTarget(Part.Footer),
            Scope([Selector.Class(Part.ProjectGrid), Selector.Element(Tag.Paragraph)]),
        ], [Declaration.ColorOf(palette.muted)]),
        On(Scope([article, Selector.Class(Part.Callout)]), [
            Declaration.Background(theme.callout.background),
            Declaration.BorderLeft(Border.Solid(Size.Rem(0.25), theme.callout.accent)),
        ]),
        On(Scope([article, Selector.Element(Tag.Pre)]), [Declaration.Background(palette.code)]),
        On(PartTarget(Part.SyntaxKeyword), [Declaration.ColorOf(syntax.keyword)]),
        On(PartTarget(Part.SyntaxType), [Declaration.ColorOf(syntax.typeName)]),
        On(PartTarget(Part.SyntaxFunction), [Declaration.ColorOf(syntax.functionName)]),
        On(PartTarget(Part.SyntaxString), [Declaration.ColorOf(syntax.stringValue)]),
        On(PartTarget(Part.SyntaxLiteral), [Declaration.ColorOf(syntax.literal)]),
        On(PartTarget(Part.SyntaxComment), [Declaration.ColorOf(syntax.comment)]),
    ];
}

function BaseRules(theme: Theme): Rule[] {
    const divider = Border.Solid(Size.Px(1.0), Color.LineToken);
    const article = Selector.Element(Tag.Article);
    const projects = Selector.Class(Part.ProjectGrid);
    const shell = Selector.Class(Part.DocsShell);
    const nav = Selector.Element(Tag.Nav);
    const link = ElementTarget(Tag.Link);
    const skip = PartTarget(Part.Skip);

    return [
        On(Scope([Selector.Root]), [
            Declaration.FontFamily(Font.Interface), Declaration.LineHeight(1.6), Declaration.SiteColorSchemes,
        ]),
        On(Scope([Selector.Universal]), [Declaration.BorderBox]),
        On(ElementTarget(Tag.Body), [Declaration.Margin(Spacing.All(Size.Zero))]),
        On(link, [Declaration.ColorOf(Color.AccentToken), Declaration.UnderlineOffset(Size.Em(0.2))]),
        On(link with { state: State.FocusVisible }, [Declaration.OutlineOffset(Size.Px(4.0))]),
        On(skip, [
            Declaration.Positioned(Position.Absolute), Declaration.Top(Size.Rem(-10.0)),
            Declaration.Left(Size.Rem(1.0)), Declaration.Layer(1),
            Declaration.Padding(Spacing.Axes(Size.Rem(0.6), Size.Rem(1.0))),
        ]),
        On(skip with { state: State.Focus }, [Declaration.Top(Size.Rem(0.75))]),
        On(PartTarget(Part.HeaderInner), [
            Declaration.DisplayAs(Display.Flex), Declaration.JustifyBetween, Declaration.AlignCenter,
            Declaration.Gap(Size.Rem(1.0)), Declaration.MinHeight(Size.Rem(4.0)),
            Declaration.MaxWidth(theme.maxPageWidth), Declaration.Margin(Spacing.All(Size.Auto)),
            Declaration.Padding(Spacing.Axes(Size.Rem(0.75), theme.horizontalInset)),
        ]),
        On(Scope([Selector.Class(Part.Header), Selector.Class(Part.Brand)]), [Declaration.FontWeight(700), Declaration.DecorationNone]),
        Shared([PartTarget(Part.Home), PartTarget(Part.DocsShell)], [
            Declaration.MaxWidth(theme.maxPageWidth), Declaration.Margin(Spacing.All(Size.Auto)),
            Declaration.Padding(Spacing.Axes(theme.verticalInset, theme.horizontalInset)),
        ]),
        On(PartTarget(Part.Home), [Declaration.MinHeight(Size.ViewHeight(65.0))]),
        Shared([ElementTarget(Tag.Heading1), ElementTarget(Tag.Heading2), ElementTarget(Tag.Heading3)], [
            Declaration.LineHeight(1.2), Declaration.WrapAs(Wrap.Anywhere),
        ]),
        On(ElementTarget(Tag.Heading1), [
            Declaration.Margin(Spacing.Sides(Size.Zero, Size.Zero, Size.Rem(1.0), Size.Zero)),
            Declaration.FontSize(Size.FluidRem(2.0, 5.0, 3.3)), Declaration.LetterSpacing(Size.Em(-0.035)),
        ]),
        On(PartTarget(Part.Intro), [
            Declaration.MaxWidth(Size.Rem(39.0)), Declaration.FontSize(Size.Rem(1.125)),
        ]),
        On(PartTarget(Part.ProjectGrid), [
            Declaration.ListUnmarked, Declaration.Padding(Spacing.All(Size.Zero)),
            Declaration.Margin(Spacing.Sides(Size.Rem(2.5), Size.Zero, Size.Zero, Size.Zero)),
            Declaration.DisplayAs(Display.Grid), Declaration.Columns([Track.AutoFit(Size.Rem(17.0))]),
            Declaration.Gap(Size.Rem(1.0)),
        ]),
        On(Scope([projects, Selector.Element(Tag.Item)]), [
            Declaration.AllBorders(divider),
            Declaration.Padding(Spacing.All(Size.Rem(1.25))), Declaration.Radius(Size.Rem(0.35)),
        ]),
        On(Scope([projects, Selector.Element(Tag.Heading2)]), [
            Declaration.Margin(Spacing.Sides(Size.Zero, Size.Zero, Size.Rem(0.6), Size.Zero)),
            Declaration.FontSize(Size.Rem(1.25)),
        ]),
        On(Scope([projects, Selector.Element(Tag.Paragraph)]), [
            Declaration.Margin(Spacing.All(Size.Zero)),
        ]),
        DocsGridRule(theme.docsGrid),
        On(Scope([shell, Selector.Element(Tag.Main)]), [Declaration.MaxWidth(Size.Rem(52.0))]),
        On(Scope([shell, nav]), [
            Declaration.BorderRight(divider), Declaration.PaddingRight(Size.Rem(1.25)),
            Declaration.Positioned(Position.Sticky), Declaration.Top(Size.Rem(1.5)),
        ]),
        On(Scope([shell, nav, Selector.Class(Part.ProjectTitle), Selector.Element(Tag.Link)]), [
            Declaration.ColorOf(Color.Inherit), Declaration.DecorationNone,
        ]),
        On(PartTarget(Part.ProjectTitle), [
            Declaration.Margin(Spacing.Sides(Size.Zero, Size.Zero, Size.Rem(0.5), Size.Zero)), Declaration.FontWeight(700),
        ]),
        On(Scope([shell, nav, Selector.Element(Tag.List)]), [
            Declaration.ListUnmarked, Declaration.Padding(Spacing.All(Size.Zero)), Declaration.Margin(Spacing.All(Size.Zero)),
        ]),
        On(Scope([shell, nav, Selector.Element(Tag.Item)]), [Declaration.MarginBottom(Size.Rem(0.5))]),
        On({ path: [shell, nav, Selector.Element(Tag.Link)], state: State.CurrentPage }, [Declaration.FontWeight(650)]),
        On(Scope([shell, Selector.Class(Part.Outline)]), [
            Declaration.AllBorders(Border.None), Declaration.BorderLeft(divider),
            Declaration.Padding(Spacing.Sides(Size.Zero, Size.Zero, Size.Zero, Size.Rem(1.0))),
        ]),
        On(Scope([Selector.Class(Part.Outline), Selector.Element(Tag.Paragraph)]), [
            Declaration.Margin(Spacing.Sides(Size.Zero, Size.Zero, Size.Rem(0.5), Size.Zero)), Declaration.FontWeight(700),
        ]),
        CalloutRule(theme.callout),
        Shared([Scope([article, Selector.Element(Tag.Heading2)]), Scope([article, Selector.Element(Tag.Heading3)])], [
            Declaration.MarginTop(Size.Rem(2.0)), Declaration.ScrollMarginTop(Size.Rem(1.0)),
        ]),
        On(Scope([article, Selector.Element(Tag.Pre)]), [
            Declaration.OverflowAuto, Declaration.Padding(Spacing.All(Size.Rem(1.0))),
            Declaration.Radius(Size.Rem(0.3)),
        ]),
        On(Scope([article, Selector.Element(Tag.Code)]), [Declaration.FontFamily(Font.Code), Declaration.WrapAs(Wrap.Anywhere)]),
        On(Scope([article, Selector.Element(Tag.Pre), Selector.Element(Tag.Code)]), [Declaration.WrapAs(Wrap.Normal)]),
        On(Scope([article, Selector.Element(Tag.Image)]), [Declaration.MaxWidth(Size.Percent(100.0))]),
        On(Scope([article, Selector.Element(Tag.Table)]), [
            Declaration.DisplayAs(Display.Block), Declaration.HorizontalOverflowAuto, Declaration.CollapseBorders,
        ]),
        Shared([Scope([article, Selector.Element(Tag.Th)]), Scope([article, Selector.Element(Tag.Td)])], [
            Declaration.AllBorders(divider), Declaration.Padding(Spacing.Axes(Size.Rem(0.35), Size.Rem(0.75))),
        ]),
        Shared([PartTarget(Part.Provenance), PartTarget(Part.Footer)], [
            Declaration.BorderTop(divider),
        ]),
        On(PartTarget(Part.Provenance), [Declaration.MarginTop(Size.Rem(2.5)), Declaration.PaddingTop(Size.Rem(1.0))]),
        On(PartTarget(Part.Footer), [
            Declaration.Padding(Spacing.Axes(Size.Rem(1.25), theme.horizontalInset)),
            Declaration.CenterText, Declaration.FontSize(Size.Rem(0.875)),
        ]),
    ];
}

function ResponsiveRules(theme: Theme): Section[] {
    const shell = Selector.Class(Part.DocsShell);
    const shellTarget = PartTarget(Part.DocsShell);
    const outline = Scope([shell, Selector.Class(Part.Outline)]);
    const main = Scope([shell, Selector.Element(Tag.Main)]);
    const grid: DocsGrid = theme.docsGrid;
    const tablet = grid with { columns: [Track.Fixed(Size.Rem(11.0)), Track.Flexible(1)] };
    const phone = grid with { columns: [Track.Flexible(1)] };

    return [
        Section.MaxWidthRem(theme.tabletBreakpoint, [
            On(shellTarget, [Declaration.Columns(tablet.columns)]),
            On(outline, [Declaration.Column(2), Declaration.Row(1), Declaration.Positioned(Position.Static)]),
            On(main, [Declaration.Column(2)]),
        ]),
        Section.MaxWidthRem(theme.phoneBreakpoint, [
            On(shellTarget, [Declaration.Columns(phone.columns)]),
            On(Scope([shell, Selector.Element(Tag.Nav)]), [
                Declaration.Positioned(Position.Static), Declaration.BorderRight(Border.None),
                Declaration.BorderBottom(Border.Solid(Size.Px(1.0), Color.LineToken)),
                Declaration.PaddingBottom(Size.Rem(0.75)),
            ]),
            Shared([outline, main], [Declaration.Column(1), Declaration.AutoRow]),
        ]),
    ];
}

export function Style(): string {
    const theme: Theme = DefaultTheme();
    const responsive: Section[] = ResponsiveRules(theme);
    return FormatStyleSheet([
        Section.Base(BaseRules(theme)), Section.Base(PaletteRules(theme)),
        Section.DarkPreference(PaletteRules(DarkTheme(theme))),
        responsive[0], responsive[1],
    ]);
}

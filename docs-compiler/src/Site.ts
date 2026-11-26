import { Link, NavigationGroup, ProjectLink, RenderIndex, RenderNotFound, Route } from "./Portal";
import { AppendChapterContents, DocumentPart, RenderDocument } from "./Article";
import { Installation } from "./pages/Installation";
import { OctCli } from "./pages/OctCli";
import { WritingDocs } from "./pages/WritingDocs";
import { Book } from "./pages/book/Book";
import { FirstProgram } from "./pages/book/FirstProgram";
import { Values } from "./pages/book/Values";
import { Records } from "./pages/book/Records";
import { RecordTables } from "./pages/book/RecordTables";
import { Enums } from "./pages/book/Enums";
import { Fallibility } from "./pages/book/Fallibility";
import { Classes } from "./pages/book/Classes";
import { Modules } from "./pages/book/Modules";
import { ScreenState } from "./pages/book/ScreenState";
import { UiEvents } from "./pages/book/UiEvents";
import { StaleResponses } from "./pages/book/StaleResponses";
import { StateAndEffects } from "./pages/book/StateAndEffects";
import { AsyncEstimates } from "./pages/book/AsyncEstimates";
import { BatchEstimates } from "./pages/book/BatchEstimates";
import { TypeRequirements } from "./pages/book/TypeRequirements";
import { GenericsTemplates } from "./pages/book/GenericsTemplates";
import { StaticEvaluation } from "./pages/book/StaticEvaluation";
import { NpmPackages } from "./pages/book/NpmPackages";
import { NugetPackages } from "./pages/book/NugetPackages";
import { PackageTargets } from "./pages/book/PackageTargets";
import { EditorSetup } from "./pages/book/EditorSetup";
import { FirstView } from "./pages/book/FirstView";
import { InteractiveUi } from "./pages/book/InteractiveUi";
import { UiLayout } from "./pages/book/UiLayout";
import { UiComponents } from "./pages/book/UiComponents";
import { UiForms } from "./pages/book/UiForms";
import { UiTesting } from "./pages/book/UiTesting";
import { UiPublishing } from "./pages/book/UiPublishing";
import { Style } from "./Theme";

export enum PageId {
    Install, Author, Cli, BookIndex, FirstProgram, EditorSetup, Values, Records, RecordTables, Enums, Fallibility, Classes, Modules,
    FirstView, InteractiveUi, UiLayout, UiComponents, UiForms, UiTesting, UiPublishing,
    ScreenState, UiEvents, StaleResponses, StateAndEffects, AsyncEstimates, BatchEstimates,
    TypeRequirements, GenericsTemplates, StaticEvaluation,
    NpmPackages, NugetPackages, PackageTargets,
}

export record Page {
    id: PageId;
    slug: string;
    part: string;
    title: string;
    summary: string;
    source: string;
}

export record Project {
    slug: string;
    title: string;
    summary: string;
    pages: Page[];
}

export record PagePlan {
    route: string;
    project: Link;
    page: Page;
    navigation: NavigationGroup[];
}

export record StaticFile {
    path: string;
    content: string;
}

function Origin(): string { return "https://yuechen-li-dev.github.io"; }

function Projects(): Project[] {
    return [
        { slug: "aetheris", title: "Aetheris", summary: "Engineering CAD, Firmament, and the Aetheris Preview 2 manual.", pages: [] },
        { slug: "copeland-ts", title: "Copeland TS", summary: "Learn Copeland TS and build an interactive UI.", pages: [
            { id: PageId.BookIndex, slug: "book", part: "", title: "The Copeland TS Book", summary: "Learn Copeland TS by building small programs and a browser UI.", source: "" },
            { id: PageId.EditorSetup, slug: "editor-setup", part: "Getting started", title: "Set up your editor", summary: "Check the toolchain and verify file ownership in a mixed VS Code workspace.", source: "" },
            { id: PageId.FirstProgram, slug: "first-program", part: "Getting started", title: "Your first program", summary: "Compile a Copeland module and run it in Node.", source: "" },
            { id: PageId.Values, slug: "values-and-functions", part: "Copeland TS basics", title: "Values and functions", summary: "Use explicit types to define and call a rule.", source: "" },
            { id: PageId.Records, slug: "records-and-collections", part: "Copeland TS basics", title: "Records and collections", summary: "Model tasks, update records, and build arrays.", source: "" },
            { id: PageId.RecordTables, slug: "record-tables-and-queries", part: "Copeland TS basics", title: "Record tables and queries", summary: "Declare a typed table, filter and project its rows, and calculate totals.", source: "" },
            { id: PageId.Enums, slug: "enums-and-match", part: "Copeland TS basics", title: "Payload enums and match", summary: "Model alternatives and handle each case.", source: "" },
            { id: PageId.Fallibility, slug: "absence-and-failure", part: "Copeland TS basics", title: "Absence and failure", summary: "Use Option and Result to express distinct outcomes.", source: "" },
            { id: PageId.Classes, slug: "classes", part: "Copeland TS basics", title: "Classes and immutable values", summary: "Validate construction and give a value its own update rules.", source: "" },
            { id: PageId.Modules, slug: "modules-and-testing", part: "Copeland TS basics", title: "Modules, targets, and testing", summary: "Organize code and test the target you ship.", source: "" },
            { id: PageId.FirstView, slug: "first-view", part: "Build a UI", title: "Render your first view", summary: "Build a TSX article panel and open it in the browser.", source: "" },
            { id: PageId.ScreenState, slug: "model-ui-state", part: "Build a UI", title: "Model a loading screen", summary: "Turn a TypeScript kind union into a payload enum and render every case.", source: "" },
            { id: PageId.UiEvents, slug: "reduce-ui-events", part: "Build a UI", title: "Reduce UI events", summary: "Use a reducer to decide which clicks and responses change the screen.", source: "" },
            { id: PageId.InteractiveUi, slug: "wire-ui-events", part: "Build a UI", title: "Wire the view to events and state", summary: "Send selections and retries from the browser through the reducer.", source: "" },
            { id: PageId.UiLayout, slug: "layout-and-styling", part: "Build a UI", title: "Lay out and style the panel", summary: "Make the panel reflow at narrow widths and inspect a typed Copeland layout.", source: "" },
            { id: PageId.UiComponents, slug: "reusable-components", part: "Build a UI", title: "Extract reusable components", summary: "Extract a typed view and keep the article list and its controls stable.", source: "" },
            { id: PageId.UiForms, slug: "forms-and-accessibility", part: "Build a UI", title: "Add a search form", summary: "Validate search input and make the flow work with a keyboard.", source: "" },
            { id: PageId.AsyncEstimates, slug: "async-estimates", part: "Concurrency", title: "Wait for work with async and await", summary: "Load task estimates and handle a typed failure after awaiting the result.", source: "" },
            { id: PageId.StaleResponses, slug: "stale-ui-responses", part: "Concurrency", title: "Handle out-of-order responses", summary: "Track request identity so old responses cannot overwrite the current view.", source: "" },
            { id: PageId.StateAndEffects, slug: "state-and-effects-with-flow", part: "Concurrency", title: "Model state and effects with flow", summary: "Declare the states a request can move through and let the host run its effects.", source: "" },
            { id: PageId.BatchEstimates, slug: "batch-estimates", part: "Concurrency", title: "Score independent items with batch", summary: "Apply the queue rule to an array and keep the results in input order.", source: "" },
            { id: PageId.UiTesting, slug: "test-your-ui", part: "Ship the UI", title: "Test the UI", summary: "Check state transitions and exercise the rendered screen in a browser.", source: "" },
            { id: PageId.UiPublishing, slug: "publish-your-ui", part: "Ship the UI", title: "Build and publish the UI", summary: "Serve the browser output from a clean static directory.", source: "" },
            { id: PageId.TypeRequirements, slug: "types-and-interfaces", part: "Metaprogramming", title: "Name types and express requirements", summary: "Use aliases to name types and interfaces to constrain reusable operations.", source: "" },
            { id: PageId.GenericsTemplates, slug: "generics-and-templates", part: "Metaprogramming", title: "Reuse code with generics and templates", summary: "Reuse a declaration across types, specialize it with static arguments, or construct a value at build time.", source: "" },
            { id: PageId.StaticEvaluation, slug: "static-evaluation", part: "Metaprogramming", title: "Precompute values with static", summary: "Evaluate a known part of the program at build time and weigh the cost of embedding it.", source: "" },
            { id: PageId.NpmPackages, slug: "npm-packages", part: "Packages and interoperability", title: "Use npm packages", summary: "Lock a JavaScript dependency, declare a typed import, and run the emitted code on Node.", source: "" },
            { id: PageId.NugetPackages, slug: "nuget-packages", part: "Packages and interoperability", title: "Use NuGet packages", summary: "Restore a .NET assembly and call it directly from generated C#.", source: "" },
            { id: PageId.PackageTargets, slug: "package-targets", part: "Packages and interoperability", title: "Use both ecosystems in one app", summary: "Trace an npm call across the .NET-to-Node bridge and use its result with a NuGet library.", source: "" },
            { id: PageId.Install, slug: "installation", part: "", title: "Installation", summary: "Install the qualified Copeland TS preview compiler and extension.",
                source: "" },
            { id: PageId.Author, slug: "writing-docs", part: "", title: "Writing docs", summary: "Author typed pages with native document components.", source: "" },
        ] },
        { slug: "oct", title: "Oct", summary: "Find the CLI commands for building, testing, and inspecting Oct programs.", pages: [
            { id: PageId.Cli, slug: "cli", part: "", title: "CLI quick reference", summary: "Common Oct commands and build-time tooling.",
                source: "https://github.com/yuechen-li-dev/oct/blob/da8b97236b6eeb8bbd72c84b254e988a31eb19a6/docs/CLI.md" },
        ] },
    ];
}

export function Content(id: PageId): Document {
    return match id {
        Install => Installation(),
        Author => WritingDocs(),
        Cli => OctCli(),
        BookIndex => Book(),
        EditorSetup => EditorSetup(),
        FirstProgram => FirstProgram(),
        Values => Values(),
        Records => Records(),
        RecordTables => RecordTables(),
        Enums => Enums(),
        Fallibility => Fallibility(),
        Classes => Classes(),
        Modules => Modules(),
        FirstView => FirstView(),
        ScreenState => ScreenState(),
        UiEvents => UiEvents(),
        InteractiveUi => InteractiveUi(),
        UiLayout => UiLayout(),
        UiComponents => UiComponents(),
        UiForms => UiForms(),
        UiTesting => UiTesting(),
        UiPublishing => UiPublishing(),
        StaleResponses => StaleResponses(),
        StateAndEffects => StateAndEffects(),
        AsyncEstimates => AsyncEstimates(),
        BatchEstimates => BatchEstimates(),
        TypeRequirements => TypeRequirements(),
        GenericsTemplates => GenericsTemplates(),
        StaticEvaluation => StaticEvaluation(),
        NpmPackages => NpmPackages(),
        NugetPackages => NugetPackages(),
        PackageTargets => PackageTargets(),
    };
}

function PageRoute(project: string, page: Page): string ! string {
    if (page.part == "") { return Route(project, page.slug); }
    const root: string = Route(project, "")?;
    const path: string = Route("book", page.slug)?;
    return ok(String.Slice(root, 0, root.length - 1) + path);
}

function BuildNavigation(project: Project, book: boolean): NavigationGroup[] ! string {
    const navigation = MutableList<NavigationGroup>();
    let title = "";
    let links = MutableList<ProjectLink>();
    for (let index: int = 0; index < project.pages.length; index = index + 1) {
        const page: Page = project.pages[index];
        if (book && page.part == "" && page.slug != "book") { continue; }
        if (!book && page.part != "") { continue; }
        if (page.part != title) {
            if (links.length > 0) {
                navigation.append({ title: title, links: links.freeze() });
            }
            title = page.part;
            links = MutableList<ProjectLink>();
        }
        links.append({ title: page.title, url: PageRoute(project.slug, page)?, summary: page.summary });
    }
    if (links.length > 0) {
        navigation.append({ title: title, links: links.freeze() });
    }
    return ok(navigation.freeze());
}

export function PlanPages(): PagePlan[] ! string {
    const projects: Project[] = Projects();
    const plans = MutableList<PagePlan>();
    for (let index: int = 0; index < projects.length; index = index + 1) {
        const project: Project = projects[index];
        const root: string = Route(project.slug, "")?;
        const links: NavigationGroup[] = BuildNavigation(project, false)?;
        const chapters: NavigationGroup[] = BuildNavigation(project, true)?;
        for (let pageIndex: int = 0; pageIndex < project.pages.length; pageIndex = pageIndex + 1) {
            const page: Page = project.pages[pageIndex];
            plans.append({
                route: PageRoute(project.slug, page)?,
                project: { title: project.title, url: root },
                page: page,
                navigation: if page.slug == "book" || page.part != "" { chapters } else { links },
            });
        }
    }
    return ok(plans.freeze());
}

export function RenderArticle(plan: PagePlan, parts: DocumentPart[]): StaticFile ! string {
    const page: Page = plan.page;
    const content: DocumentPart[] = if page.slug == "book" { AppendChapterContents(parts, plan.navigation) } else { parts };
    return ok({
        path: plan.route,
        content: RenderDocument(page.title, page.summary, Origin() + plan.route, plan.project, plan.navigation, content, page.source)?,
    });
}

export function RenderDirectories(): StaticFile[] ! string {
    const projects: Project[] = Projects();
    const output = MutableList<StaticFile>();
    const cards = MutableList<ProjectLink>();
    for (let index: int = 0; index < projects.length; index = index + 1) {
        const project: Project = projects[index];
        const root: string = Route(project.slug, "")?;
        cards.append({ title: project.title, url: root, summary: project.summary });
        if (project.pages.length == 0) { continue; }
        const links = MutableList<ProjectLink>();
        for (let entry: int = 0; entry < project.pages.length; entry = entry + 1) {
            const page: Page = project.pages[entry];
            if (project.slug == "copeland-ts" && page.slug != "book") { continue; }
            links.append({ title: page.title, url: PageRoute(project.slug, page)?, summary: page.summary });
        }
        const summary: string = if project.slug == "copeland-ts" { "Project homepage in progress." } else { project.summary };
        output.append({ path: root, content: RenderIndex(project.title, summary, links.freeze(), Origin() + root) });
    }
    output.append({ path: "/", content: RenderIndex("Project documentation",
        "Browse the manuals and reference guides for each engineering project.", cards.freeze(), Origin() + "/") });
    output.append({ path: "/404.html", content: RenderNotFound() });
    output.append({ path: "/_docs/site.css", content: Style() });
    return ok(output.freeze());
}

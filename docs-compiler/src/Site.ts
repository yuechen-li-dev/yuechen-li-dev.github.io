import { Link, ProjectLink, RenderIndex, RenderNotFound, Route } from "./Portal";
import { DocumentPart, RenderDocument } from "./Article";
import { Installation } from "./pages/Installation";
import { OctCli } from "./pages/OctCli";
import { WritingDocs } from "./pages/WritingDocs";
import { Book } from "./pages/book/Book";
import { FirstProgram } from "./pages/book/FirstProgram";
import { Values } from "./pages/book/Values";
import { Records } from "./pages/book/Records";
import { Enums } from "./pages/book/Enums";
import { Fallibility } from "./pages/book/Fallibility";
import { Modules } from "./pages/book/Modules";
import { ScreenState } from "./pages/book/ScreenState";
import { UiEvents } from "./pages/book/UiEvents";
import { StaleResponses } from "./pages/book/StaleResponses";
import { AsyncEstimates } from "./pages/book/AsyncEstimates";
import { BatchEstimates } from "./pages/book/BatchEstimates";
import { TypeRequirements } from "./pages/book/TypeRequirements";
import { GenericsTemplates } from "./pages/book/GenericsTemplates";
import { StaticEvaluation } from "./pages/book/StaticEvaluation";
import { NpmPackages } from "./pages/book/NpmPackages";
import { NugetPackages } from "./pages/book/NugetPackages";
import { PackageTargets } from "./pages/book/PackageTargets";
import { Style } from "./Theme";

export enum PageId {
    Install, Author, Cli, BookIndex, FirstProgram, Values, Records, Enums, Fallibility, Modules,
    ScreenState, UiEvents, StaleResponses, AsyncEstimates, BatchEstimates,
    TypeRequirements, GenericsTemplates, StaticEvaluation,
    NpmPackages, NugetPackages, PackageTargets,
}

export record Page {
    id: PageId;
    slug: string;
    section: string;
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
    navigation: Link[];
}

export record StaticFile {
    path: string;
    content: string;
}

function Origin(): string { return "https://yuechen-li-dev.github.io"; }

function Projects(): Project[] {
    return [
        { slug: "aetheris", title: "Aetheris", summary: "Engineering CAD, Firmament, and the Aetheris Preview 2 manual.", pages: [] },
        { slug: "copeland-ts", title: "Copeland TS", summary: "Learn Copeland TS and build your first program.", pages: [
            { id: PageId.BookIndex, slug: "book", section: "", title: "The Copeland TS Book", summary: "Learn the language by building small programs.", source: "" },
            { id: PageId.FirstProgram, slug: "first-program", section: "book", title: "Your first program", summary: "Compile a Copeland module and run it in Node.", source: "" },
            { id: PageId.Values, slug: "values-and-functions", section: "book", title: "Values and functions", summary: "Use explicit types to define and call a rule.", source: "" },
            { id: PageId.Records, slug: "records-and-collections", section: "book", title: "Records and collections", summary: "Model tasks, update records, and build arrays.", source: "" },
            { id: PageId.Enums, slug: "enums-and-match", section: "book", title: "Payload enums and match", summary: "Model alternatives and handle each case.", source: "" },
            { id: PageId.Fallibility, slug: "absence-and-failure", section: "book", title: "Absence and failure", summary: "Use Option and Result to express distinct outcomes.", source: "" },
            { id: PageId.Modules, slug: "modules-and-testing", section: "book", title: "Modules, targets, and testing", summary: "Organize code and test the target you ship.", source: "" },
            { id: PageId.ScreenState, slug: "model-ui-state", section: "book", title: "Model a loading screen", summary: "Turn a TypeScript kind union into a payload enum and render every case.", source: "" },
            { id: PageId.UiEvents, slug: "reduce-ui-events", section: "book", title: "Reduce UI events", summary: "Use a reducer to decide which clicks and responses change the screen.", source: "" },
            { id: PageId.StaleResponses, slug: "stale-ui-responses", section: "book", title: "Handle out-of-order responses", summary: "Track request identity so old responses cannot overwrite the current view.", source: "" },
            { id: PageId.AsyncEstimates, slug: "async-estimates", section: "book", title: "Wait for work with async and await", summary: "Load task estimates and handle success and failure after awaiting the result.", source: "" },
            { id: PageId.BatchEstimates, slug: "batch-estimates", section: "book", title: "Score independent items with batch", summary: "Apply the queue rule to an array and keep the results in input order.", source: "" },
            { id: PageId.TypeRequirements, slug: "types-and-interfaces", section: "book", title: "Name types and express requirements", summary: "Use aliases to name types and interfaces to constrain reusable operations.", source: "" },
            { id: PageId.GenericsTemplates, slug: "generics-and-templates", section: "book", title: "Reuse code with generics and templates", summary: "Reuse a declaration across types, specialize it with static arguments, or construct a value at build time.", source: "" },
            { id: PageId.StaticEvaluation, slug: "static-evaluation", section: "book", title: "Precompute values with static", summary: "Evaluate a known part of the program at build time and weigh the cost of embedding it.", source: "" },
            { id: PageId.NpmPackages, slug: "npm-packages", section: "book", title: "Use npm packages", summary: "Lock a JavaScript dependency, declare a typed import, and run the emitted code on Node.", source: "" },
            { id: PageId.NugetPackages, slug: "nuget-packages", section: "book", title: "Use NuGet packages", summary: "Restore a .NET assembly and call it directly from generated C#.", source: "" },
            { id: PageId.PackageTargets, slug: "package-targets", section: "book", title: "Use both ecosystems in one app", summary: "Trace an npm call across the .NET-to-Node bridge and use its result with a NuGet library.", source: "" },
            { id: PageId.Install, slug: "installation", section: "", title: "Installation", summary: "Build and install the local-feed preview of Copeland TS.",
                source: "https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/installation.md" },
            { id: PageId.Author, slug: "writing-docs", section: "", title: "Writing docs", summary: "Author typed pages with native document components.", source: "" },
        ] },
        { slug: "oct", title: "Oct", summary: "Find the CLI commands for building, testing, and inspecting Oct programs.", pages: [
            { id: PageId.Cli, slug: "cli", section: "", title: "CLI quick reference", summary: "Common Oct commands and build-time tooling.",
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
        FirstProgram => FirstProgram(),
        Values => Values(),
        Records => Records(),
        Enums => Enums(),
        Fallibility => Fallibility(),
        Modules => Modules(),
        ScreenState => ScreenState(),
        UiEvents => UiEvents(),
        StaleResponses => StaleResponses(),
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
    if (page.section == "") { return Route(project, page.slug); }
    const root: string = Route(project, "")?;
    const path: string = Route(page.section, page.slug)?;
    return ok(String.Slice(root, 0, root.length - 1) + path);
}

export function PlanPages(): PagePlan[] ! string {
    const projects: Project[] = Projects();
    const plans = MutableList<PagePlan>();
    for (let index: int = 0; index < projects.length; index = index + 1) {
        const project: Project = projects[index];
        const root: string = Route(project.slug, "")?;
        const navigation = MutableList<Link>();
        const bookNavigation = MutableList<Link>();
        for (let pageIndex: int = 0; pageIndex < project.pages.length; pageIndex = pageIndex + 1) {
            const page: Page = project.pages[pageIndex];
            const link: Link = { title: page.title, url: PageRoute(project.slug, page)? };
            if (page.section == "") { navigation.append(link); }
            if (page.slug == "book" || page.section == "book") { bookNavigation.append(link); }
        }
        const links: Link[] = navigation.freeze();
        const chapters: Link[] = bookNavigation.freeze();
        for (let pageIndex: int = 0; pageIndex < project.pages.length; pageIndex = pageIndex + 1) {
            const page: Page = project.pages[pageIndex];
            const inBook: boolean = page.slug == "book" || page.section == "book";
            plans.append({
                route: PageRoute(project.slug, page)?,
                project: { title: project.title, url: root },
                page: page,
                navigation: if inBook { chapters } else { links },
            });
        }
    }
    return ok(plans.freeze());
}

export function RenderArticle(plan: PagePlan, parts: DocumentPart[]): StaticFile ! string {
    const page: Page = plan.page;
    return ok({
        path: plan.route,
        content: RenderDocument(page.title, page.summary, Origin() + plan.route, plan.project, plan.navigation, parts, page.source)?,
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

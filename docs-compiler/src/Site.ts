import { Link, ProjectLink, RenderIndex, RenderNotFound, Route } from "./Portal";
import { DocumentPart, RenderDocument } from "./Article";
import { Installation } from "./pages/Installation";
import { OctCli } from "./pages/OctCli";
import { WritingDocs } from "./pages/WritingDocs";
import { Style } from "./Theme";

export enum PageId { Install, Author, Cli }

export record Page {
    id: PageId;
    slug: string;
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
        { slug: "copeland-ts", title: "Copeland TS", summary: "Install the compiler and write documentation in Copeland TSX.", pages: [
            { id: PageId.Install, slug: "installation", title: "Installation", summary: "Build and install the local-feed preview of Copeland TS.",
                source: "https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/installation.md" },
            { id: PageId.Author, slug: "writing-docs", title: "Writing docs", summary: "Author typed pages with native document components.", source: "" },
        ] },
        { slug: "oct", title: "Oct", summary: "Find the CLI commands for building, testing, and inspecting Oct programs.", pages: [
            { id: PageId.Cli, slug: "cli", title: "CLI quick reference", summary: "Common Oct commands and build-time tooling.",
                source: "https://github.com/yuechen-li-dev/oct/blob/da8b97236b6eeb8bbd72c84b254e988a31eb19a6/docs/CLI.md" },
        ] },
    ];
}

export function Content(id: PageId): Document {
    return match id {
        Install => Installation(),
        Author => WritingDocs(),
        Cli => OctCli(),
    };
}

export function PlanPages(): PagePlan[] ! string {
    const projects: Project[] = Projects();
    const plans = MutableList<PagePlan>();
    for (let index: int = 0; index < projects.length; index = index + 1) {
        const project: Project = projects[index];
        const root: string = Route(project.slug, "")!;
        const navigation = MutableList<Link>();
        for (let pageIndex: int = 0; pageIndex < project.pages.length; pageIndex = pageIndex + 1) {
            const page: Page = project.pages[pageIndex];
            navigation.append({ title: page.title, url: Route(project.slug, page.slug)! });
        }
        const links: Link[] = navigation.freeze();
        for (let pageIndex: int = 0; pageIndex < project.pages.length; pageIndex = pageIndex + 1) {
            plans.append({
                route: links[pageIndex].url,
                project: { title: project.title, url: root },
                page: project.pages[pageIndex],
                navigation: links,
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
        const root: string = Route(project.slug, "")!;
        cards.append({ title: project.title, url: root, summary: project.summary });
        if (project.pages.length == 0) { continue; }
        const links = MutableList<ProjectLink>();
        for (let entry: int = 0; entry < project.pages.length; entry = entry + 1) {
            const page: Page = project.pages[entry];
            links.append({ title: page.title, url: Route(project.slug, page.slug)!, summary: page.summary });
        }
        output.append({ path: root, content: RenderIndex(project.title, project.summary, links.freeze(), Origin() + root) });
    }
    output.append({ path: "/", content: RenderIndex("Project documentation",
        "Browse the manuals and reference guides for each engineering project.", cards.freeze(), Origin() + "/") });
    output.append({ path: "/404.html", content: RenderNotFound() });
    output.append({ path: "/_docs/site.css", content: Style() });
    return ok(output.freeze());
}

export type CopelandProfile = "JavaScript";

import { ClassAttribute, Part } from "./StyleSheet";

export record ProjectLink {
    title: string;
    url: string;
    summary: string;
}

export record Link {
    title: string;
    url: string;
}

export record NavigationGroup {
    title: string;
    links: ProjectLink[];
}

function IsSlug(value: string): boolean {
    const length: int = value.length;
    if (length == 0) { return false; }
    let previousDash = true;
    for (let index: int = 0; index < length; index = index + 1) {
        const code = String.CodeAt(value, index);
        const dash: boolean = code == 45;
        const letter: boolean = code >= 97 && code <= 122;
        const digit: boolean = code >= 48 && code <= 57;
        if (!(letter || digit || dash) || (dash && previousDash)) {
            return false;
        }
        previousDash = dash;
    }
    return !previousDash;
}

export function Route(project: string, page: string): string ! string {
    if (!IsSlug(project)) { return err("Invalid project slug: " + project); }
    if (page == "") { return ok("/" + project + "/"); }
    if (!IsSlug(page)) { return err("Invalid page slug: " + page); }
    return ok("/" + project + "/" + page + "/");
}

export function ValidateRoutes(routes: string[]): void ! string {
    for (let index: int = 0; index < routes.length; index = index + 1) {
        for (let prior: int = 0; prior < index; prior = prior + 1) {
            if (routes[prior] == routes[index]) {
                return err("Duplicate page route: " + routes[index]);
            }
        }
    }
    return;
}

export function Escape(value: string): string {
    let escaped = "";
    for (let index: int = 0; index < value.length; index = index + 1) {
        const code = String.CodeAt(value, index);
        if (code == 38) { escaped = escaped + "&amp;"; }
        else if (code == 60) { escaped = escaped + "&lt;"; }
        else if (code == 62) { escaped = escaped + "&gt;"; }
        else if (code == 34) { escaped = escaped + "&quot;"; }
        else { escaped = escaped + String.FromCode(code); }
    }
    return escaped;
}

export function Anchor(url: string, title: string): string {
    return '<a href="' + Escape(url) + '">' + Escape(title) + "</a>";
}

function Layout(title: string, description: string, canonical: string, main: string): string {
    let head: string = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        "<title>" + Escape(title) + " · Engineering Docs</title>" +
        '<meta name="description" content="' + Escape(description) + '">';
    if (canonical != "") {
        head = head + '<link rel="canonical" href="' + Escape(canonical) + '">';
    }
    return head + '<link rel="stylesheet" href="/_docs/site.css"></head><body>' +
        '<a' + ClassAttribute(Part.Skip) + ' href="#content">Skip to content</a>' +
        '<header' + ClassAttribute(Part.Header) + '><div' + ClassAttribute(Part.HeaderInner) + ">" +
        '<a' + ClassAttribute(Part.Brand) + ' href="/">Engineering Docs</a>' +
        '<a href="https://github.com/yuechen-li-dev">GitHub</a>' +
        "</div></header>" + main +
        '<footer' + ClassAttribute(Part.Footer) + '>Documentation by Yuechen Li and contributors</footer></body></html>';
}

export function RenderIndex(title: string, description: string, projects: ProjectLink[], canonical: string): string {
    let cards = "";
    for (let index: int = 0; index < projects.length; index = index + 1) {
        const project: ProjectLink = projects[index];
        cards = cards + "<li><h2>" + Anchor(project.url, project.title) + "</h2><p>" +
            Escape(project.summary) + "</p></li>";
    }
    return Layout(title, description, canonical,
        '<main id="content"' + ClassAttribute(Part.Home) + "><h1>" + Escape(title) + "</h1>" +
        "<p" + ClassAttribute(Part.Intro) + ">" + Escape(description) +
        "</p><ul" + ClassAttribute(Part.ProjectGrid) + ">" + cards + "</ul></main>");
}

function RenderNavigation(navigation: NavigationGroup[], canonical: string): string {
    let menu = "";
    for (let groupIndex: int = 0; groupIndex < navigation.length; groupIndex = groupIndex + 1) {
        const group: NavigationGroup = navigation[groupIndex];
        let items = "";
        let current = false;
        for (let index: int = 0; index < group.links.length; index = index + 1) {
            const link: ProjectLink = group.links[index];
            if (canonical.length >= link.url.length
                && String.Slice(canonical, canonical.length - link.url.length, canonical.length) == link.url) {
                items = items + '<li><a aria-current="page" href="' + Escape(link.url) + '">' + Escape(link.title) + "</a></li>";
                current = true;
            } else {
                items = items + "<li>" + Anchor(link.url, link.title) + "</li>";
            }
        }
        const list: string = "<ul>" + items + "</ul>";
        if (group.title == "") {
            menu = menu + list;
        } else {
            const open: string = if current { " open" } else { "" };
            menu = menu + "<details" + open + "><summary>" + Escape(group.title) + "</summary>" + list + "</details>";
        }
    }
    return menu;
}

export function RenderPage(title: string, description: string, canonical: string,
    project: Link, navigation: NavigationGroup[], articleHtml: string, outline: string, source: string): string {
    let provenance = "";
    if (source != "") {
        provenance = "<p" + ClassAttribute(Part.Provenance) + ">" + Anchor(source, "View this revision on GitHub") + "</p>";
    }
    const main: string = "<div" + ClassAttribute(Part.DocsShell) + '><nav aria-label="Project documentation">' +
        "<p" + ClassAttribute(Part.ProjectTitle) + ">" + Anchor(project.url, project.title) + "</p>" +
        RenderNavigation(navigation, canonical) + "</nav>" +
        '<main id="content"><article><h1>' + Escape(title) + "</h1>" + articleHtml +
        provenance + "</article></main>" + outline + "</div>";
    return Layout(title, description, canonical, main);
}

export function RenderNotFound(): string {
    return Layout("Page not found", "This documentation page could not be found.", "",
        '<main id="content"' + ClassAttribute(Part.Home) + "><h1>Page not found</h1>" +
        '<p><a href="/">Browse project documentation</a></p></main>');
}

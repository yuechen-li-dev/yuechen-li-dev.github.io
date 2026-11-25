export type CopelandProfile = "JavaScript";

export record ProjectLink {
    title: string;
    url: string;
    summary: string;
}

export record Link {
    title: string;
    url: string;
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

function Escape(value: string): string {
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

function Anchor(url: string, title: string): string {
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
        '<a class="skip" href="#content">Skip to content</a>' +
        '<header class="site-header"><div class="header-inner">' +
        '<a class="brand" href="/">Engineering Docs</a>' +
        '<a href="https://github.com/yuechen-li-dev">GitHub</a>' +
        "</div></header>" + main +
        '<footer class="site-footer">Documentation by Yuechen Li and contributors</footer></body></html>';
}

export function RenderIndex(title: string, description: string, projects: ProjectLink[], canonical: string): string {
    let cards = "";
    for (let index: int = 0; index < projects.length; index = index + 1) {
        const project: ProjectLink = projects[index];
        cards = cards + "<li><h2>" + Anchor(project.url, project.title) + "</h2><p>" +
            Escape(project.summary) + "</p></li>";
    }
    return Layout(title, description, canonical,
        '<main id="content" class="home"><h1>' + Escape(title) + "</h1>" +
        '<p class="intro">' + Escape(description) + '</p><ul class="project-grid">' + cards + "</ul></main>");
}

export function RenderPage(title: string, description: string, canonical: string,
    project: Link, navigation: Link[], articleHtml: string, source: string): string {
    let menu = "";
    for (let index: int = 0; index < navigation.length; index = index + 1) {
        const link: Link = navigation[index];
        menu = menu + "<li>" + Anchor(link.url, link.title) + "</li>";
    }
    let provenance = "";
    if (source != "") {
        provenance = '<p class="provenance">' + Anchor(source, "View this revision on GitHub") + "</p>";
    }
    const main: string = '<div class="docs-layout"><nav aria-label="Project documentation">' +
        '<p class="project-title">' + Anchor(project.url, project.title) + "</p><ul>" + menu + "</ul></nav>" +
        '<main id="content"><article><h1>' + Escape(title) + "</h1>" + articleHtml +
        provenance + "</article></main></div>";
    return Layout(title, description, canonical, main);
}

export function RenderNotFound(): string {
    return Layout("Page not found", "This documentation page could not be found.", "",
        '<main id="content" class="home"><h1>Page not found</h1>' +
        '<p><a href="/">Browse project documentation</a></p></main>');
}

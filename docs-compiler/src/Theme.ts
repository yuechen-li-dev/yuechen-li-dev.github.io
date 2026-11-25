export function Style(): string {
    return `:root {
  font-family: "Segoe UI", system-ui, sans-serif;
  color: #172638;
  background: #f7f9fc;
  line-height: 1.6;
  --accent: #135b82;
  --line: #d6e0e9;
}

* { box-sizing: border-box; }
body { margin: 0; }
a { color: var(--accent); text-underline-offset: .2em; }
a:hover { color: #0b405d; }
a:focus-visible { outline: 2px solid #257bac; outline-offset: 4px; }
.skip { position: absolute; top: -10rem; left: 1rem; z-index: 1; padding: .6rem 1rem; background: white; }
.skip:focus { top: .75rem; }
.site-header { background: #152b3d; color: #fff; }
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  min-height: 4rem;
  max-width: 76rem;
  margin: auto;
  padding: .75rem clamp(1.25rem, 5vw, 3rem);
}
.site-header a { color: #e4f0f6; }
.site-header .brand { font-weight: 700; text-decoration: none; }
.home, .docs-layout { max-width: 76rem; margin: auto; padding: clamp(1.5rem, 6vw, 5rem) clamp(1.25rem, 5vw, 3rem); }
.home { min-height: 65vh; }
h1, h2, h3 { line-height: 1.2; overflow-wrap: anywhere; }
h1 { margin: 0 0 1rem; font-size: clamp(2rem, 5vw, 3.3rem); letter-spacing: -.035em; }
.intro { max-width: 39rem; font-size: 1.125rem; color: #4b5d70; }
.project-grid { list-style: none; padding: 0; margin: 2.5rem 0 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr)); gap: 1rem; }
.project-grid li { border: 1px solid var(--line); background: white; padding: 1.25rem; border-radius: .35rem; }
.project-grid h2 { margin: 0 0 .6rem; font-size: 1.25rem; }
.project-grid p { margin: 0; color: #4b5d70; }
.docs-layout { display: grid; grid-template-columns: 12rem minmax(0, 1fr) 12rem; gap: clamp(1.5rem, 4vw, 3rem); align-items: start; }
.docs-layout main { max-width: 52rem; }
.docs-layout nav { border-right: 1px solid var(--line); padding-right: 1.25rem; position: sticky; top: 1.5rem; }
.docs-layout nav .project-title a { color: inherit; text-decoration: none; }
.project-title { margin: 0 0 .5rem; font-weight: 700; }
.docs-layout nav ul { list-style: none; padding: 0; margin: 0; }
.docs-layout nav li { margin-bottom: .5rem; }
.docs-layout nav a[aria-current="page"] { font-weight: 650; }
.docs-layout .outline { border: 0; border-left: 1px solid var(--line); padding: 0 0 0 1rem; }
.outline p { margin: 0 0 .5rem; font-weight: 700; }
article .callout { background: #e7f2f8; border-left: .25rem solid #2f789b; padding: .85rem 1.1rem; margin: 1.5rem 0; }
article h2, article h3 { margin-top: 2rem; scroll-margin-top: 1rem; }
article pre { overflow: auto; padding: 1rem; background: #eaf0f6; border-radius: .3rem; }
article code { font-family: Consolas, "Liberation Mono", monospace; overflow-wrap: anywhere; }
article pre code { overflow-wrap: normal; }
article img { max-width: 100%; }
article table { display: block; overflow-x: auto; border-collapse: collapse; }
article th, article td { border: 1px solid var(--line); padding: .35rem .75rem; }
.provenance, .site-footer { border-top: 1px solid var(--line); color: #4b5d70; }
.provenance { margin-top: 2.5rem; padding-top: 1rem; }
.site-footer { padding: 1.25rem clamp(1.25rem, 5vw, 3rem); text-align: center; font-size: .875rem; }

@media (max-width: 63rem) {
  .docs-layout { grid-template-columns: 11rem minmax(0, 1fr); }
  .docs-layout .outline { grid-column: 2; grid-row: 1; position: static; }
  .docs-layout main { grid-column: 2; }
}
@media (max-width: 44rem) {
  .docs-layout { grid-template-columns: minmax(0, 1fr); }
  .docs-layout nav { position: static; border-right: 0; border-bottom: 1px solid var(--line); padding-bottom: .75rem; }
  .docs-layout .outline, .docs-layout main { grid-column: 1; grid-row: auto; }
}`;
}

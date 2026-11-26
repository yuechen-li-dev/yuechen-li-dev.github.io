export function UiLayout(): Document {
    return <Document>
        <Paragraph>Open the [article panel](/copeland-ts/book/example/) and select **Patterns in UI**, then **Records in practice**. The search controls and article list keep their places as the details update. In this chapter, keep that arrangement on a wide screen and let the list and details stack on a narrow one.</Paragraph>
        <Heading level="2">Decide what stays in place</Heading>
        <Paragraph>The browser shell owns two regions. The first contains the search form and article choices. The second contains the details Copeland produces. Keep that order in the markup so a reader reaches the controls before the content they change. The same order works when the two regions sit beside each other.</Paragraph>
        <Paragraph>Keep the controls mounted when an article loads. The host can update the detail region while a user is typing a query or has a button focused. The Copeland view decides what the detail heading and paragraphs say. A long title changes the amount of space that content needs, and the layout lets the region grow.</Paragraph>
        <Heading level="2">Give the detail region room to shrink</Heading>
        <Paragraph>Open `examples/article-panel/web/style.css`. The `.article-layout` grid keeps the list between 14 and 20 rem wide on a wide display, then gives the detail region the remaining space. The zero minimum on the flexible track lets it shrink below the intrinsic width of an unbroken title. Aligning the grid items at the start lets each region keep its own height.</Paragraph>
        <CodeBlock language="css">
.article-layout {
  display: grid;
  grid-template-columns: minmax(14rem, 20rem) minmax(0, 1fr);
  gap: var(--space);
  align-items: start;
}

@media (max-width: 44rem) {
  .article-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
        </CodeBlock>
        <Paragraph>The media query changes placement while leaving the document order intact. The stylesheet uses `--space` for the grid gap and the panel padding, and `--line` for the shared border color. Try changing the grid gap to `2rem` and observe which spacing changes. The panel rule also uses `overflow-wrap: anywhere` so an unbroken title can wrap inside the narrowed track.</Paragraph>
        <Heading level="2">Declare spatial intent in Copeland</Heading>
        <Paragraph>In a Copeland layout, a named slot represents a region in a finite spatial structure. The compiler checks the slot names, dimensions, and supported style fields. The following declarations are a separate exercise. The article-panel fixture uses the CSS grid above.</Paragraph>
        <CodeBlock language="copeland-fragment">
layout ReadingRoom<0px, 0px> {
    width: 720px;
    height: 360px;

    row root {
        gap: 12px;
        slot list { width: 200px; height: fill; }
        slot detail {
            width: fill;
            height: fill;
            style: { fill: "#fffefb" };
        }
    }
}

layout RoomierReadingRoom<0px, 0px> = ReadingRoom with { root.gap: 24px; };
        </CodeBlock>
        <Paragraph>Each declaration specifies its own origin. The detail slot fills the remaining row width. Its surface style travels with that slot. The derived layout uses `with` to replace the gap while preserving the two named slots and their other properties. This is the same record-update idea you used for application data, applied to a compiler-checked layout.</Paragraph>
        <Paragraph>Save the declarations as `ReadingRoom.ts` in an empty directory outside a TSPack workspace. Inspect the derived layout to see the root row and its two slots.</Paragraph>
        <CodeBlock language="console">
tscl layout inspect RoomierReadingRoom --source ReadingRoom.ts
        </CodeBlock>
        <Heading level="2">A stream gives each slot its content</Heading>
        <Paragraph>A layout defines the named slots and their geometry. A contribution `stream` supplies the view for each name. The `list` slot in `ReadingRoom` tells the compiler how much space to reserve. The `list` entry in a stream tells it which view belongs in that space. The expression `bind ReadingRoom using Content` joins those declarations by slot name and returns a renderable view.</Paragraph>
        <Paragraph>Suppose the reading room also has a narrow arrangement. Add a column layout with the same `list` and `detail` slots. In a workspace configured with `CopelandViews` and a stateless presentation adapter, the same content can go into either layout.</Paragraph>
        <CodeBlock language="copeland-fragment">
layout CompactReadingRoom<0px, 0px> {
    width: 320px;
    height: 360px;
    column root {
        gap: 12px;
        slot list { height: 72px; }
        slot detail { height: fill; }
    }
}

export function ReadingView(title: string, narrow: boolean): View {
    stream Content {
        list: <aside>Choose an article</aside>;
        detail: <article><h2>{title}</h2></article>;
    }
    if (narrow) {
        return bind CompactReadingRoom using Content;
    }
    return bind ReadingRoom using Content;
}
        </CodeBlock>
        <Paragraph>Read this as three steps. Each call to `ReadingView` constructs the two contributions once. The `if` selects an arrangement. The bind expression places those already constructed values in that layout’s slots. The layout determines presentation order. You can rearrange the slots without editing the content or passing generated class names through the views.</Paragraph>
        <Paragraph>This is the wiring the compiler handles for you. It checks that every slot has exactly one renderable contribution, then builds the layout hosts and connects each contribution to its host through the chosen presentation adapter. Rename `detail` to `details` in the stream and the compiler can point out that the layout still expects `detail`. The author chooses the semantic elements such as `aside` and `article`, and the caller supplies the `narrow` decision.</Paragraph>
        <Heading level="2">Declare placement and content together</Heading>
        <Paragraph>When one arrangement and its content always go together, give the stream an origin and put both in the same declaration. Each named entry supplies a view and the geometry for its slot. A flat body arranges the entries in a column.</Paragraph>
        <CodeBlock language="copeland-fragment">
stream ReadingColumn<0px, 0px> {
    width: 320px;
    height: 360px;
    list: <aside>Choose an article</aside> { height: 72px; }
    detail: <article>Article details</article> { height: fill; }
}
        </CodeBlock>
        <Paragraph>The compiler works out the layout and bindings from that one declaration. Call `ReadingColumnStream()` for the composed view. Use a separate `layout` and contribution `stream` when you want to put the same content in several arrangements. Both forms need a supported presentation target. The book’s article-panel demo uses the CSS grid above. See the [layout language guide](https://github.com/yuechen-li-dev/Copeland/blob/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/docs/Copeland/language/layout.md).</Paragraph>
        <Heading level="2">Check the layout with real content</Heading>
        <List>
            <Item><Paragraph>At a wide viewport, select **Patterns in UI**. Verify that both regions are visible and the detail area fills the space beside the list.</Paragraph></Item>
            <Item><Paragraph>Narrow the viewport to 320 CSS pixels. Check that the list comes first, the details follow, and the page only needs vertical scrolling.</Paragraph></Item>
            <Item><Paragraph>In `web/browser.mjs`, temporarily give one record in `articles` a title with a long unbroken word. Run `node build.mjs` again, then load that article at 320 CSS pixels and confirm the title wraps inside **Article details**. Tab through the controls at both widths and check their order and focus indicators.</Paragraph></Item>
        </List>
        <Paragraph>The [W3C guide to reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) explains why the narrow check matters. Next, [extract reusable components](/copeland-ts/book/reusable-components/) while keeping the placement rules in one place.</Paragraph>
    </Document>;
}

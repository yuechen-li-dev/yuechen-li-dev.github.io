# Article panel

The runnable example for the UI chapters of the Copeland TS Book. The
Copeland modules define the model, transitions, query rules, and TSX view.
The supplied browser adapter connects these to native controls and the DOM.

Run from this directory with Node.js 22, the .NET 10 SDK, and the book's
preview `tscl` on PATH.

```sh
node build.mjs
node --test tests/panel.test.mjs
node serve.mjs
```

Open `http://127.0.0.1:4173/`. Use **Fail next load** to try the retry flow.
Choose **Patterns in UI**, then **Records in practice** while the first load
is pending to exercise out-of-order completion. The demo uses a local fixture
and timers for both responses. Set `COPELAND_CLI` to a compiler DLL path to
use a source build instead of the installed tool.

Copy the whole `dist/` directory to deploy it. The site build compiles and
copies the same example under `/copeland-ts/book/example/`.

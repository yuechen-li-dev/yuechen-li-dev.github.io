import {
  Initial, LatestRequest, Matches, Receive, Reject, Select, Snapshot, ValidateQuery,
} from "./src/Panel.node.js";
import { View } from "./src/View.node.js";
import { renderDocument } from "./document.mjs";

const articles = {
  patterns: { title: "Patterns in UI", delay: 500 },
  records: { title: "Records in practice", delay: 40 },
};
const panelView = document.querySelector("#panel-view");
const panelStatus = document.querySelector("#panel-status");
const retry = document.querySelector("#retry");
const failNext = document.querySelector("#fail-next");
const form = document.querySelector("#article-search");
const query = document.querySelector("#query");
const queryError = document.querySelector("#query-error");
const searchStatus = document.querySelector("#search-status");
const articleButtons = [...document.querySelectorAll("[data-article]")];

let model = Initial();
let lastArticle;

function render() {
  const { status, title, canRetry } = Snapshot(model);
  panelView.replaceChildren(renderDocument(View(status, title)));
  if (panelStatus.textContent !== status) panelStatus.textContent = status;
  retry.disabled = !canRetry;
}

// The delays make old responses reproducible without an external service.
async function select(article) {
  lastArticle = article;
  model = Select(model);
  const requestId = LatestRequest(model);
  const shouldFail = failNext.checked;
  failNext.checked = false;
  render();

  await new Promise((resolve) => setTimeout(resolve, article.delay));
  model = shouldFail
    ? Reject(model, requestId, "Demo failure")
    : Receive(model, requestId, article.title);
  render();
}

function applySearch(event) {
  event.preventDefault();
  const result = ValidateQuery(query.value.trim());
  if (result.tag === "err") {
    query.setAttribute("aria-invalid", "true");
    queryError.textContent = result.error;
    queryError.hidden = false;
    query.focus();
    return;
  }

  query.removeAttribute("aria-invalid");
  queryError.hidden = true;
  queryError.textContent = "";
  const term = result.value.toLowerCase();
  let count = 0;
  for (const button of articleButtons) {
    const title = articles[button.dataset.article].title.toLowerCase();
    const matches = Matches(title, term);
    button.closest("li").hidden = !matches;
    if (matches) count++;
  }
  searchStatus.textContent = count === 1 ? "1 article" : count + " articles";
}

for (const button of articleButtons) {
  button.addEventListener("click", () => void select(articles[button.dataset.article]));
}
retry.addEventListener("click", () => {
  if (!lastArticle) return;
  // Retry becomes disabled during a load. Keep focus on the corresponding article.
  articleButtons.find((button) => articles[button.dataset.article] === lastArticle
    && !button.closest("li").hidden)?.focus();
  if (document.activeElement === retry) query.focus();
  void select(lastArticle);
});
form.addEventListener("submit", applySearch);
render();

import assert from "node:assert/strict";
import test from "node:test";
import {
  Initial, LatestRequest, Matches, Receive, Reject, Select, Snapshot, ValidateQuery,
} from "../dist/src/Panel.node.js";
import { View } from "../dist/src/View.node.js";

test("a completion belongs to the current request", () => {
  const first = Select(Initial());
  const second = Select(first);
  const oldId = LatestRequest(first);
  const activeId = LatestRequest(second);
  assert.notEqual(oldId, activeId);
  assert.deepEqual(Receive(second, oldId, "Patterns in UI"), second);
  assert.deepEqual(Reject(second, oldId, "Old failure"), second);

  const ready = Receive(second, activeId, "Records in practice");
  assert.deepEqual(Snapshot(ready), {
    status: "Loaded Records in practice",
    title: "Records in practice",
    canRetry: false,
  });
  assert.deepEqual(Receive(ready, oldId, "Patterns in UI"), ready);
});

test("an active failure enables retry and a fresh selection clears it", () => {
  const pending = Select(Initial());
  const failed = Reject(pending, LatestRequest(pending), "Demo failure");
  assert.equal(Snapshot(failed).status, "Could not load: Demo failure");
  assert.equal(Snapshot(failed).canRetry, true);
  const retrying = Select(failed);
  assert.notEqual(LatestRequest(retrying), LatestRequest(pending));
  assert.equal(Snapshot(retrying).canRetry, false);
});

test("query validation and matching have separate outcomes", () => {
  assert.deepEqual(ValidateQuery(""), { tag: "ok", value: "" });
  assert.deepEqual(ValidateQuery("x"), { tag: "err", error: "Use at least 2 characters." });
  assert.deepEqual(ValidateQuery("x".repeat(61)), { tag: "err", error: "Use at most 60 characters." });
  assert.deepEqual(ValidateQuery("records"), { tag: "ok", value: "records" });
  assert.equal(Matches("records in practice", "records"), true);
  assert.equal(Matches("patterns in ui", "records"), false);
});

test("TSX preserves heading structure and inserts title text as data", () => {
  const text = (events) => events.filter((event) => event.tag === "Run").map((event) => event.payload.text);
  assert.deepEqual(text(View("Choose an article", "")), ["Article details", "Choose an article"]);

  const events = View("Loaded", "Courses < drafts");
  const headings = events.filter((event) => event.tag === "Open" && event.payload.node.tag === "Heading");
  assert.deepEqual(headings.map((event) => event.payload.node.payload.level), ["2"]);
  assert.deepEqual(text(events), ["Article details", "Courses < drafts"]);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { filterStories, stories, regions } from "../public/app.js";
test("anglers can combine a fishing facet and case-insensitive search", () => {
  assert.ok(filterStories(stories, "all", "").length >= 3);
  const found = filterStories(stories, "offshore", "SNOEK");
  assert.ok(found.length > 0);
  assert.ok(found.every((s) => s.facets.includes("offshore")));
});
test("unmatched search gives an empty result and clearing recovers all stories", () => {
  assert.equal(filterStories(stories, "all", "no-such-fish-xyz").length, 0);
  assert.equal(filterStories(stories, "all", "").length, stories.length);
});
test("every region offers a descriptive source-backed destination", () => {
  assert.equal(Object.keys(regions).length, 4);
  for (const r of Object.values(regions)) {
    assert.ok(r.title);
    assert.match(r.url, /^https:\/\/(www.ecr.co.za|anglernews.co.za)/);
  }
});

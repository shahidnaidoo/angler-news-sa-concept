import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ports,
  fetchConditions,
  daySeries,
  pressureChange,
  chartPoints,
} from "../public/conditions.js";
const fixture = (key, values) => ({
  hourly: {
    time: values.map(
      (_, i) =>
        `2026-10-${16 + Math.floor(i / 24)}T${String(i % 24).padStart(2, "0")}:00`,
    ),
    [key]: values,
  },
});
test("forecasts use public sea-level/pressure endpoints and South African local time", async () => {
  const urls = [];
  const result = await fetchConditions(
    "durban",
    async (url) => {
      urls.push(url);
      return {
        ok: true,
        json: async () =>
          url.includes("marine-api")
            ? fixture(
                "sea_level_height_msl",
                Array.from({ length: 72 }, (_, i) => i / 10),
              )
            : fixture("pressure_msl", Array(72).fill(1012)),
      };
    },
    new Date("2026-10-16T12:00:00+02:00"),
  );
  assert.equal(result.marine.hourly.sea_level_height_msl.length, 72);
  assert.equal(urls.length, 2);
  assert.ok(
    urls.every(
      (u) => new URL(u).searchParams.get("timezone") === "Africa/Johannesburg",
    ),
  );
  assert.equal(Object.keys(ports).length, 4);
});
test("provider failure and null-only forecasts reject without invented fallback data", async () => {
  await assert.rejects(
    fetchConditions("durban", async () => ({ ok: false })),
    /unavailable/i,
  );
  await assert.rejects(
    fetchConditions("durban", async () => ({
      ok: true,
      json: async () => ({
        hourly: { time: [], sea_level_height_msl: [], pressure_msl: [] },
      }),
    })),
    /unavailable/i,
  );
});
test("day switching preserves local date and excludes null values, not coercing null to zero", () => {
  const source = {
    time: ["2026-10-16T00:00", "2026-10-16T01:00", "2026-10-17T00:00"],
    sea_level_height_msl: [null, -0.4, 0.7],
  };
  assert.deepEqual(daySeries(source, "sea_level_height_msl", "2026-10-16"), [
    { time: "2026-10-16T01:00", value: -0.4 },
  ]);
  assert.equal(
    daySeries(source, "sea_level_height_msl", "2026-10-17")[0].value,
    0.7,
  );
});
test("pressure trend uses the actual three-hour change and handles incomplete readings", () => {
  const series = Array.from({ length: 24 }, (_, h) => ({
    time: `2026-10-16T${String(h).padStart(2, "0")}:00`,
    value: 1015 - h / 2,
  }));
  assert.equal(pressureChange(series).direction, "falling");
  assert.equal(pressureChange(series).delta, -1.5);
  assert.equal(pressureChange([]), null);
  assert.equal(
    pressureChange(series.map((s) => ({ ...s, value: 1014 }))).direction,
    "steady",
  );
});
test("chart preserves hour spacing when there is a missing reading and handles flat data", () => {
  const points = chartPoints([
    { time: "2026-10-16T00:00", value: 1012 },
    { time: "2026-10-16T12:00", value: 1012 },
  ]);
  assert.equal(points.length, 2);
  assert.ok(points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)));
  assert.ok(points[1].x > points[0].x);
});
test("stale forecasts cannot be presented as freshly fetched current guidance", async () => {
  const stale = async (url) => ({
    ok: true,
    json: async () =>
      url.includes("marine-api")
        ? fixture("sea_level_height_msl", Array(72).fill(0.5))
        : fixture("pressure_msl", Array(72).fill(1012)),
  });
  await assert.rejects(
    fetchConditions("durban", stale, new Date("2026-10-19T12:00:00+02:00")),
    /expired|unavailable/i,
  );
});

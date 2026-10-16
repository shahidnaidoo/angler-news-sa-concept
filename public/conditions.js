export const ports = {
  durban: { name: "Durban", lat: -29.87, lon: 31.05 },
  richards: { name: "Richards Bay", lat: -28.8, lon: 32.1 },
  eastLondon: { name: "East London", lat: -33.04, lon: 27.91 },
  capeTown: { name: "Cape Town", lat: -33.93, lon: 18.43 },
};
export function sastDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export async function fetchConditions(port, fetcher = fetch, now = new Date()) {
  const p = ports[port];
  if (!p) throw new Error("Unknown coastal location");
  const params = new URLSearchParams({
    latitude: p.lat,
    longitude: p.lon,
    timezone: "Africa/Johannesburg",
    forecast_days: "3",
  });
  const urls = [
    `https://marine-api.open-meteo.com/v1/marine?${params}&hourly=sea_level_height_msl&cell_selection=sea`,
    `https://api.open-meteo.com/v1/forecast?${params}&hourly=pressure_msl`,
  ];
  const [marine, weather] = await Promise.all(
    urls.map(async (u) => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await fetcher(u, {
            signal: AbortSignal.timeout(6000),
          });
          if (!response.ok) throw new Error("Forecast unavailable");
          return await response.json();
        } catch (error) {
          if (attempt === 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, 350));
        }
      }
    }),
  );
  const today = sastDate(now);
  const expectedDates = Array.from({ length: 3 }, (_, i) =>
    new Date(Date.parse(today + "T00:00:00Z") + i * 86400000)
      .toISOString()
      .slice(0, 10),
  );
  for (const [data, key] of [
    [marine, "sea_level_height_msl"],
    [weather, "pressure_msl"],
  ]) {
    if (
      !Array.isArray(data?.hourly?.time) ||
      !data.hourly.time.length ||
      !Array.isArray(data.hourly[key]) ||
      !data.hourly[key].some(Number.isFinite)
    )
      throw new Error("Forecast unavailable");
    const dates = new Set(
      data.hourly.time.map((t) =>
        typeof t === "string" ? t.slice(0, 10) : "",
      ),
    );
    if (
      data.hourly.time[0].slice(0, 10) !== today ||
      !expectedDates.every((d) => dates.has(d))
    )
      throw new Error("Forecast expired or unavailable");
  }
  return { marine, weather, forecastDate: today, fetchedAt: now.toISOString() };
}
export function daySeries(hourly, key, date) {
  return (hourly?.time || []).flatMap((time, i) =>
    time.startsWith(date) && Number.isFinite(hourly[key]?.[i])
      ? [{ time, value: hourly[key][i] }]
      : [],
  );
}
export function pressureChange(series) {
  const noon = series.find((s) => s.time.slice(11, 13) === "12");
  const before = series.find((s) => s.time.slice(11, 13) === "09");
  if (!noon || !before) return null;
  const delta = Math.round((noon.value - before.value) * 10) / 10;
  return {
    delta,
    direction: delta > 0.5 ? "rising" : delta < -0.5 ? "falling" : "steady",
  };
}
export function chartPoints(series) {
  if (!series.length) return [];
  const lo = Math.min(...series.map((s) => s.value));
  const hi = Math.max(...series.map((s) => s.value));
  const padding = Math.max((hi - lo) * 0.18, 0.08);
  return series.map((s) => ({
    x: 20 + (Number(s.time.slice(11, 13)) / 23) * 680,
    y: 210 - ((s.value - lo + padding) / (hi - lo + 2 * padding)) * 170,
    time: s.time,
    value: s.value,
  }));
}
const trendCopy = {
  falling: {
    title: "Falling pressure",
    text: "A falling barometer can signal changing weather. Check the wind, swell and local warnings before choosing an exposed mark.",
  },
  rising: {
    title: "Rising pressure",
    text: "Pressure is building. A ridging high can still bring strong onshore wind on the SA coast; a higher reading does not guarantee calm water.",
  },
  steady: {
    title: "Steady pressure",
    text: "Little change over this three-hour window. Read it alongside tide stage, water clarity, wind and your own local catch history.",
  },
};
function chart(series, type) {
  const points = chartPoints(series);
  if (!points.length)
    return '<p class="chart-unavailable">No model values available for this day.</p>';
  const unit = type === "sea" ? "metres above mean sea level" : "hPa";
  const title =
    type === "sea"
      ? "Modelled sea level including tides"
      : "Forecast sea-level pressure";
  let d = "";
  points.forEach((p, i) => {
    const previous = points[i - 1];
    const gap =
      previous &&
      Number(p.time.slice(11, 13)) - Number(previous.time.slice(11, 13)) > 1;
    d += `${!i || gap ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)} `;
  });
  return `<svg class="forecast-svg" viewBox="0 0 720 240" role="img" aria-label="${title}; ${unit}. Hourly values available in the data table below."><defs><linearGradient id="fill-${type}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${type === "sea" ? "#277f88" : "#bf302b"}" stop-opacity=".16"/><stop offset="1" stop-color="${type === "sea" ? "#277f88" : "#bf302b"}" stop-opacity="0"/></linearGradient></defs><path class="chart-grid" d="M20 40H700M20 125H700M20 210H700"/><path d="${d}L${points.at(-1).x},230 L${points[0].x},230 Z" fill="url(#fill-${type})"/><path d="${d}" class="chart-line ${type}"/><line class="chart-cursor" x1="375" x2="375" y1="25" y2="230"/></svg><div class="chart-hours"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div>`;
}
export function initConditions() {
  const section = document.querySelector("#conditions");
  if (!section) return;
  const location = document.querySelector("#forecast-port");
  const status = document.querySelector("#forecast-status");
  const content = document.querySelector("#forecast-content");
  const error = document.querySelector("#forecast-error");
  const days = document.querySelector("#forecast-days");
  const slider = document.querySelector("#forecast-hour");
  let current = null;
  let date = "";
  let request = 0;
  const cache = new Map();
  function readout() {
    if (!current) return;
    const hour = String(slider.value).padStart(2, "0");
    const time = `${date}T${hour}:00`;
    slider.setAttribute("aria-valuetext", `${hour}:00 SAST`);
    const sea = daySeries(
      current.marine.hourly,
      "sea_level_height_msl",
      date,
    ).find((s) => s.time === time);
    const pressure = daySeries(
      current.weather.hourly,
      "pressure_msl",
      date,
    ).find((s) => s.time === time);
    document.querySelector("#selected-hour").textContent = `${hour}:00 SAST`;
    document.querySelector("#selected-sea").textContent = sea
      ? `${sea.value.toFixed(2)} m`
      : "Unavailable";
    document.querySelector("#selected-pressure").textContent = pressure
      ? `${Math.round(pressure.value)} hPa`
      : "Unavailable";
    section.querySelectorAll(".chart-cursor").forEach((line) => {
      const x = 20 + (Number(hour) / 23) * 680;
      line.setAttribute("x1", x);
      line.setAttribute("x2", x);
    });
  }
  function renderDay() {
    const sea = daySeries(current.marine.hourly, "sea_level_height_msl", date);
    const pressure = daySeries(current.weather.hourly, "pressure_msl", date);
    document.querySelector("#sea-chart").innerHTML = chart(sea, "sea");
    document.querySelector("#pressure-chart").innerHTML = chart(
      pressure,
      "pressure",
    );
    const trend = pressureChange(pressure);
    const high = sea.reduce((a, s) => (!a || s.value > a.value ? s : a), null);
    const low = sea.reduce((a, s) => (!a || s.value < a.value ? s : a), null);
    document.querySelector("#sea-high").textContent = high
      ? `${high.time.slice(11)} · ${high.value.toFixed(2)} m`
      : "Unavailable";
    document.querySelector("#sea-low").textContent = low
      ? `${low.time.slice(11)} · ${low.value.toFixed(2)} m`
      : "Unavailable";
    document.querySelector("#pressure-trend").textContent = trend
      ? `${trendCopy[trend.direction].title} · ${trend.delta > 0 ? "+" : ""}${trend.delta.toFixed(1)} hPa`
      : "Trend unavailable";
    document.querySelector("#pressure-context").textContent = trend
      ? trendCopy[trend.direction].text
      : "Insufficient model data for a three-hour comparison.";
    document.querySelector("#hourly-data").replaceChildren(
      ...Array.from({ length: 24 }, (_, i) => {
        const h = String(i).padStart(2, "0");
        const time = `${date}T${h}:00`;
        const a = sea.find((s) => s.time === time),
          b = pressure.find((s) => s.time === time);
        const tr = document.createElement("tr");
        tr.innerHTML = `<th scope="row">${h}:00</th><td>${a ? a.value.toFixed(2) : "—"}</td><td>${b ? b.value.toFixed(1) : "—"}</td>`;
        return tr;
      }),
    );
    days
      .querySelectorAll("button")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.date === date)),
      );
    const label = new Date(date + "T12:00:00+02:00").toLocaleDateString(
      "en-ZA",
      {
        timeZone: "Africa/Johannesburg",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    );
    document.querySelector("#forecast-date-label").textContent =
      `${ports[location.value].name} · ${label}`;
    readout();
  }
  async function load(force = false) {
    const seq = ++request;
    const port = location.value;
    content.hidden = true;
    document.querySelector("#forecast-loading").hidden = false;
    error.hidden = true;
    days.replaceChildren();
    status.textContent = `Loading the ${ports[port].name} coastal forecast…`;
    section.setAttribute("aria-busy", "true");
    try {
      const entry = cache.get(port);
      const data =
        !force &&
        entry &&
        entry.forecastDate === sastDate() &&
        Date.now() - Date.parse(entry.fetchedAt) < 600000
          ? entry
          : await fetchConditions(port);
      if (seq !== request) return;
      current = data;
      cache.set(port, data);
      const dates = [
        ...new Set(data.marine.hourly.time.map((t) => t.slice(0, 10))),
      ].slice(0, 3);
      date = dates[0];
      dates.forEach((d) => {
        const button = document.createElement("button");
        button.className = "forecast-day";
        button.type = "button";
        button.dataset.date = d;
        button.textContent = new Date(d + "T12:00:00+02:00").toLocaleDateString(
          "en-ZA",
          {
            timeZone: "Africa/Johannesburg",
            weekday: "short",
            day: "numeric",
            month: "short",
          },
        );
        button.addEventListener("click", () => {
          date = d;
          renderDay();
        });
        days.append(button);
      });
      status.textContent = `Forecast fetched ${new Date(data.fetchedAt).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} SAST · model predictions`;
      content.hidden = false;
      renderDay();
    } catch {
      if (seq !== request) return;
      current = null;
      status.textContent = "Forecast currently unavailable";
      error.hidden = false;
    } finally {
      if (seq === request) {
        section.setAttribute("aria-busy", "false");
        document.querySelector("#forecast-loading").hidden = true;
      }
    }
  }
  location.addEventListener("change", () => load());
  slider.addEventListener("input", readout);
  document
    .querySelector("#refresh-forecast")
    .addEventListener("click", () => load(true));
  document
    .querySelector("#retry-forecast")
    .addEventListener("click", () => load(true));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(section);
  } else load();
}

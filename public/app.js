import { icon } from "./icons.js";
import { initConditions } from "./conditions.js";
export const stories = [
  {
    id: "zambezi",
    title: "Four hours. One extraordinary shark.",
    date: "ARCHIVE",
    type: "NORTH COAST · CATCH & RELEASE",
    image: "mike-zambezi",
    alt: "ANSA and ECR archive artwork showing Mike Vlcek with a Zambezi shark on the beach",
    facets: ["shore"],
    metric: "179.8 kg · reported by ECR",
    description:
      "Mike Vlcek’s North Coast encounter lasted four hours before the Zambezi shark was released. Explore the original ANSA report.",
    keywords: "monster shark Zambezi Mike Vlcek north coast",
    url: "https://www.ecr.co.za/shows/east-coast-breakfast/179kg-zambezi-caught-kzn-north-coast/",
  },
  {
    id: "giant-kob",
    title: "A North Coast kob to remember.",
    date: "28 MAY 2026",
    isoDate: "2026-05-28",
    type: "NORTH COAST · ARCHIVE HIGHLIGHT",
    image: "andre-kob",
    alt: "Andre Coetser kneeling on the beach at night holding a large kob",
    facets: ["shore"],
    metric: "160 cm · reported length",
    description:
      "Andre Coetser’s remarkable North Coast kob leads this ANSA archive highlight. Explore the original report and the story behind the catch.",
    keywords: "monster kob Andre Coetser north coast",
    url: "https://www.ecr.co.za/shows/east-coast-breakfast/pre-run-big-fish-action-fires-along-kzn/",
  },
  {
    id: "kayak-kingfish",
    title: "A kayak. A giant kingfish. Durban.",
    date: "ARCHIVE",
    type: "DURBAN · KAYAK FISHING",
    image: "shaun-kingfish",
    alt: "Shaun Reid holding a giant kingfish on his fishing kayak off Durban",
    facets: ["offshore"],
    metric: "30 kg · reported by ECR",
    description:
      "Shaun Reid’s giant kingfish from a kayak off Durban is one for the fishing daydreams. ECR’s archive caption reports it at 30 kg.",
    keywords: "monster giant kingfish GT Shaun Reid kayak Durban",
    url: "https://www.ecr.co.za/shows/east-coast-breakfast/kzn-fishing-picks-ahead-black-friday-weekend/",
  },
  {
    id: "hotspots",
    title: "Fishing Hotspots Heat Up",
    date: "15 OCT 2026",
    type: "KZN FISHING REPORT",
    image: "snoek",
    alt: "Vinesh Soogreem with a Natal snoek",
    facets: ["shore", "offshore", "freshwater"],
    description: "A coast-to-Midlands roundup from Vinesh and the ANSA team.",
    keywords: "kob brusher grunter snoek trout bass",
    url: "https://iono.fm/e/1728616",
  },
  {
    id: "spearfishing",
    title: "A different view beneath the surface",
    date: "ARCHIVE",
    type: "EXPERT CONVERSATION",
    image: "kingfish",
    alt: "Tanya Nadauld with a golden kingfish",
    facets: ["offshore"],
    description:
      "Explore the ANSA conversation about spearfishing with Don Solomon.",
    keywords: "kingfish spearfishing offshore",
    url: "https://www.ecr.co.za/east-coast-breakfast/spearfishing-101/",
  },
  {
    id: "voices",
    title: "Meet the voice behind the fishing reports",
    date: "ARCHIVE",
    type: "THE ANSA STORY",
    image: "vinesh",
    alt: "Vinesh Soogreem holding a kob",
    facets: ["shore", "freshwater"],
    description:
      "Get to know Vinesh Soogreem and the fishing podcast on East Coast Radio.",
    keywords: "Vinesh podcast freshwater kob",
    url: "https://www.ecr.co.za/lifestyle/family/ecr-adds-kzns-king-angling-podcast/",
  },
];
export function filterStories(items, facet, query) {
  const q = query.trim().toLowerCase();
  return items.filter(
    (s) =>
      (facet === "all" || s.facets.includes(facet)) &&
      `${s.title} ${s.description} ${s.keywords}`.toLowerCase().includes(q),
  );
}
export const regions = {
  north: {
    number: "01 / NORTH COAST",
    title: "Tongaat to Richards Bay",
    description:
      "Explore ANSA’s North Coast coverage, from shore angling to offshore stories. Start with the weekly KZN report for the latest published update.",
    url: "https://www.ecr.co.za/podcasts/ansa/",
    point: [335, 102],
  },
  durban: {
    number: "02 / DURBAN & SURROUNDS",
    title: "A city with salt in its veins",
    description:
      "Follow the Durban fishing conversation with ANSA’s local voices. Listen for reports from the rocks, beaches and offshore grounds.",
    url: "https://www.ecr.co.za/podcasts/ansa/",
    point: [287, 185],
  },
  south: {
    number: "03 / SOUTH COAST",
    title: "From Illovo to Port Edward",
    description:
      "Discover the South Coast through ANSA’s weekly coverage. Local contributors share what’s happening along this much-loved stretch of coastline.",
    url: "https://www.ecr.co.za/podcasts/ansa/",
    point: [225, 275],
  },
  midlands: {
    number: "04 / KZN MIDLANDS",
    title: "Trade the salt for fresh water",
    description:
      "Head inland with the freshwater coverage in the ANSA report. Explore the Midlands fishing conversation, from trout waters to local dams.",
    url: "https://www.ecr.co.za/podcasts/ansa/",
    point: [205, 165],
  },
};
if (typeof document !== "undefined") {
  document
    .querySelectorAll("[data-icon]")
    .forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
  initConditions();
  let facet = "all";
  const search = document.querySelector("#search");
  const list = document.querySelector("#stories");
  function render() {
    const result = filterStories(stories, facet, search.value);
    list.replaceChildren(
      ...result.map((s) => {
        const article = document.createElement("article");
        article.className = s.metric ? "story catch-story" : "story";
        article.innerHTML = `<a class="story-image" href="${s.url}" target="_blank" rel="noopener"><img src="/assets/${s.image}.webp" width="650" height="450" loading="lazy" alt="${s.alt}"><span aria-hidden="true">${icon("arrow")}</span></a><div class="story-meta"><span>${s.type}</span>${s.date === "ARCHIVE" ? "<span>ARCHIVE</span>" : '<time datetime="' + (s.isoDate || "2026-10-15") + '">' + s.date + "</time>"}</div>${s.metric ? `<p class="catch-metric">${s.metric}</p>` : ""}<h3><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></h3><p>${s.description}</p><div class="story-foot"><a href="${s.url}" target="_blank" rel="noopener">Explore story ${icon("arrow")}</a><button class="save" data-id="${s.id}" aria-label="Save ${s.title}" aria-pressed="false" title="Save story">${icon("heart")}</button></div>`;
        return article;
      }),
    );
    document.querySelector("#result-count").textContent =
      `${result.length} ${result.length === 1 ? "story" : "stories"}`;
    document.querySelector("#empty").hidden = result.length !== 0;
    list.querySelectorAll(".save").forEach((button) => {
      let saved = false;
      try {
        saved = JSON.parse(localStorage.getItem("ansa-saved") || "[]").includes(
          button.dataset.id,
        );
      } catch {}
      updateSave(button, saved);
      button.addEventListener("click", () => {
        let ids = [];
        try {
          ids = JSON.parse(localStorage.getItem("ansa-saved") || "[]");
        } catch {}
        const next = button.getAttribute("aria-pressed") !== "true";
        ids = next
          ? [...new Set([...ids, button.dataset.id])]
          : ids.filter((id) => id !== button.dataset.id);
        try {
          localStorage.setItem("ansa-saved", JSON.stringify(ids));
        } catch {}
        updateSave(button, next);
      });
    });
  }
  function updateSave(button, saved) {
    button.setAttribute("aria-pressed", String(saved));
    button.innerHTML = icon("heart");
    button.classList.toggle("saved", saved);
    button.title = saved ? "Remove saved story" : "Save story";
    button.setAttribute(
      "aria-label",
      `${saved ? "Unsave" : "Save"} ${stories.find((s) => s.id === button.dataset.id).title}`,
    );
  }
  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      facet = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((b) => {
        b.setAttribute("aria-pressed", String(b === button));
        b.classList.toggle("active", b === button);
      });
      render();
    }),
  );
  search.addEventListener("input", render);
  document.querySelector("#clear-search").addEventListener("click", () => {
    search.value = "";
    document.querySelector('[data-filter="all"]').click();
    search.focus();
  });
  render();
  function region(id) {
    const r = regions[id];
    document.querySelector("#region-number").textContent = r.number;
    document.querySelector("#region-title").textContent = r.title;
    document.querySelector("#region-description").textContent = r.description;
    document.querySelector("#region-link").href = r.url;
    document.querySelector("#map-point").setAttribute("cx", r.point[0]);
    document.querySelector("#map-point").setAttribute("cy", r.point[1]);
    document
      .querySelectorAll("[data-region]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.region === id)),
      );
  }
  document
    .querySelectorAll("[data-region]")
    .forEach((b) =>
      b.addEventListener("click", () => region(b.dataset.region)),
    );
  region("north");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#navigation");
  function closeMenu() {
    menu.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });
  nav
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menu.focus();
    }
  });
  document.querySelector("#load-player").addEventListener("click", (event) => {
    const box = document.querySelector("#player-container");
    if (!box.childElementCount) {
      const frame = document.createElement("iframe");
      frame.src = "https://iframe.iono.fm/c/8652";
      frame.title = "Official Angler News SA podcast player";
      frame.allow = "autoplay";
      frame.height = "450";
      box.append(frame);
    }
    box.hidden = false;
    event.currentTarget.setAttribute("aria-expanded", "true");
    event.currentTarget.textContent = "Podcast player loaded";
    event.currentTarget.disabled = true;
    const frame = box.querySelector("iframe");
    frame.tabIndex = 0;
    frame.focus();
  });
}

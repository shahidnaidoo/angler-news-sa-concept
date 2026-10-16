# Angler News South Africa — independent website concept

A responsive, fisherman-first editorial concept for ANSA, built for Shahid Naidoo. This is an unaffiliated pitch preview, not ANSA's operational website.

## Run

Requires Node.js 22 or later. No runtime dependencies.

```sh
npm test
npm run check
npm run build
npm run preview
```

Open http://127.0.0.1:4186.

## Included

- Official ANSA logo, attributed Vinesh portraits and authentic editorial catch imagery.
- Four-port coastal planner with three-day forecasts, linked tide/pressure charts, hourly scrubbing, accessible data table and failure/retry behavior.
- Practical pressure guidance with primary sources and no guaranteed-bite claims.
- Verified KZN catch stories with original source links and careful measurement labels.
- Search and fishing-style filters with an empty-result recovery path.
- Saved stories on the visitor's own device.
- Four-region KZN explorer with a coastline illustration.
- Click-to-load official iono.fm podcast player and direct listening fallback.
- Verified social/contact destinations, responsive navigation, branded 404 and no-index preview metadata.

See [research and audit](docs/RESEARCH.md), [design brief](docs/DESIGN-BRIEF.md) and [verification record](docs/QA.md). Existing ANSA/ECR photographs and marks remain the property of their owners. Permission is required before an operational business release. The coastal planner fetches real three-day modelled sea-level/tide and pressure forecasts from Open-Meteo for four coastal locations. It labels datum, dates, source and model limitations, validates freshness and offers retry on failure. No observations, precise harbour tide times or live catch feed are implied. This evaluation uses the provider’s prototyping tier; operational business use requires an appropriate commercial plan.

## Privacy

Saved story IDs are stored only in localStorage. Clicking to load the podcast connects to iono.fm, which receives the normal browser request. External links open the official platforms. Forecast requests send only the selected public port coordinates to Open-Meteo. Google Fonts serves the typefaces. No personal information is submitted to a backend by this concept.

## License

Source code is provided for the user's review and pitch. No open-source license has been applied. Third-party brand/photo rights are separate and are documented in the research ledger.

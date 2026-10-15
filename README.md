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

Open http://localhost:4173.

## Included

- Official ANSA logo, existing sunset fishing photograph and attributed editorial catch imagery.
- Search and fishing-style filters with an empty-result recovery path.
- Saved stories on the visitor's own device.
- Four-region KZN explorer with a coastline illustration.
- Click-to-load official iono.fm podcast player and direct listening fallback.
- Verified social/contact destinations, responsive navigation, branded 404 and no-index preview metadata.

See [research and audit](docs/RESEARCH.md), [design brief](docs/DESIGN-BRIEF.md) and [verification record](docs/QA.md). Existing ANSA/ECR photographs and marks remain the property of their owners. Permission is required before an operational business release. No analytics, newsletter form, live weather, tide or catch feed is represented as working.

## Privacy

Saved story IDs are stored only in localStorage. Clicking to load the podcast connects to iono.fm, which receives the normal browser request. External links open the official platforms. No data is submitted to a backend by this concept.

## License

Source code is provided for the user's review and pitch. No open-source license has been applied. Third-party brand/photo rights are separate and are documented in the research ledger.

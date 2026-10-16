# Coastal conditions: sources and limits

Researched and endpoint-tested: **16 October 2026, SAST**. This record supports the independent ANSA website evaluation concept. It does not certify marine conditions or fishing safety.

## Forecast provider and interpretation

- [Open-Meteo Marine API documentation](https://open-meteo.com/en/docs/marine-weather-api): `sea_level_height_msl` includes astronomical tides and other modelled sea-level components. Its datum is **global mean sea level**, not chart datum. Negative values are legitimate. SMOC tides have approximately 8 km resolution; local coastal accuracy is limited. This is not a nautical almanac or observed port gauge.
- [Open-Meteo Weather API documentation](https://open-meteo.com/en/docs): `pressure_msl` is forecast pressure reduced to mean sea level, expressed in hPa. These model values must not be described as local instrument observations or a live station reading.
- Data are fetched for three local calendar days using `timezone=Africa/Johannesburg` and `forecast_days=3`. The displayed fetch timestamp records when the website retrieved the payload; it is **not** the model issue time or an observation time. Date labels refer to forecast validity.
- Charts select hourly provider samples. Missing/nonfinite values must remain unavailable, not become zero. Daily highest/lowest samples are not necessarily exact high/low tide turning points. The fixed pressure comparison is 09:00–12:00 SAST on the selected date, not a rolling current-pressure measurement.
- Sea-level attribution: **Open-Meteo / Météo-France (SMOC)**. Pressure attribution: **Open-Meteo** and its forecast data providers. Link the provider documentation and [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); explain that the display selects hourly samples and derives its summaries.

### Direct request verification

The marine endpoint returned HTTP 200 and 72 non-null hourly sea-level values beginning `2026-10-16T00:00` at all four requested locations. The Durban weather endpoint also returned HTTP 200 with hourly pressure data. This verifies availability at the research time; it is not an uptime or accuracy guarantee.

| Display location | Requested latitude | Requested longitude |
| ---------------- | -----------------: | ------------------: |
| Durban           |             -29.87 |               31.05 |
| Richards Bay     |             -28.80 |               32.10 |
| East London      |             -33.04 |               27.91 |
| Cape Town        |             -33.93 |               18.43 |

Marine example: `https://marine-api.open-meteo.com/v1/marine?latitude=-29.87&longitude=31.05&hourly=sea_level_height_msl&forecast_days=3&timezone=Africa%2FJohannesburg&cell_selection=sea`

Pressure example: `https://api.open-meteo.com/v1/forecast?latitude=-29.87&longitude=31.05&hourly=pressure_msl&forecast_days=3&timezone=Africa%2FJohannesburg`

The provider may select a nearby sea grid cell rather than the exact requested coordinate. No fabricated fallback readings, idealised sine-wave tides or invented bite scores are appropriate.

## API service terms and commercial handover

- [Pricing](https://open-meteo.com/en/pricing) explicitly permits the free tier for evaluation and prototyping; commercial service requires a subscription and customer endpoint.
- [Service terms](https://open-meteo.com/en/terms) restrict free access to noncommercial use and classify promotional/commercial activity as commercial. The evaluation concept must not silently become an operating sponsored/ad-supported ANSA service on the free endpoint. Resolve paid provider configuration at commercial handover, keeping credentials server-side.
- Free-service limits stated on the checked terms page: fewer than 10,000 calls/day, 5,000/hour and 600/minute. Two provider requests are used per uncached location load. Terms and plan limits can change; recheck before commercial launch.
- CC BY 4.0 data licensing does not remove the separate API hosting-service restrictions. No service availability or accuracy warranty is given.

## Official South African checks

- [South African Navy Hydrographic Office](https://www.sanho.co.za/): official local port tide tables. Its published notice requires written permission before reproducing the tables. This project links to them and does not copy their predicted values into the chart.
- [SA Weather Service Marine Portal](https://marine.weathersa.co.za/index.html): marine forecasts and warnings. The user should check these alongside the official tide tables before travelling or selecting an exposed rock or beach.

## Pressure explanation: evidence grounding

- [Met Office: how pressure shapes weather](https://www.metoffice.gov.uk/blog/2026/how-pressure-drives-the-uks-journey-from-summer-to-autumn): supports hPa units, pressure gradients and associated changing weather. Falling pressure can accompany an approaching low/front; a high reading alone does not establish wind or sea state. The article's UK seasonal examples are not presented as South African seasonal rules.
- [SA Weather Service WeatherSmart, March 2020](https://www.weathersa.co.za/Documents/Corporate/SAWS%20WeatherSmart%20Newsletter%20March%2020%20WEB_03042025082342.pdf): documents a South African frontal event in which pressure configuration, wind, waves, storm surge and spring tides interacted. It grounds the instruction to read local wind/swell and warnings together, not a claim that its particular event will recur at any given pressure.
- [Bemidji State: yellow perch feeding experiment](https://pines.bemidjistate.edu/j-earth-life-sci/50/): reported no significant pressure–feeding relationship in a small freshwater experiment. It is a limited example of why blanket angling rules need caution, **not** evidence establishing how KZN marine species feed.
- No universal optimal hPa range, guaranteed feeding window, “pressure pain” mechanism, or pressure-only bite forecast is claimed. Rising/falling/steady are display summaries; the implementation's 0.5 hPa threshold is a practical UI classification, not a validated biological trigger.
- The selected guidance is: read pressure as one weather clue alongside tide, wind, swell, clarity, temperature, species and local catch history. It does not claim those factors have been experimentally ranked for every South African coastal species.

## Review scope

Source-only review covered `public/conditions.js` and `tests/conditions.test.mjs`: date handling, datum, missing data, forecast/error state, request ordering and pressure wording. This review did not use a browser and does not substitute for the parent workflow's desktop/mobile, keyboard, accessibility and deployment checks.

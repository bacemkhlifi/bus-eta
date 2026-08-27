# Bus Sfax ETA

Bus Sfax ETA is a bilingual French/Arabic web application for estimating SORETRAS bus arrival times in Sfax.

## Product Goal

The app estimates arrivals without GPS by combining:

1. Official trip schedules.
2. Ordered route stops.
3. Kilometer markers when station names are not reliable enough.
4. A confidence level that tells users whether the estimate is schedule-only or improved by fresher data.

## Current Ready-To-Use Pilot

- French and Arabic language switch.
- Dropdown flow: choose corridor/region, choose bus code, choose the nearest 0.5 km marker.
- Full urban line code catalog for the 31+ bus codes visible in the available network map.
- Kilometer estimator for major corridors including Route Gabes, M'harza, Route Gremda, Sakiet Ezzit, Sakiet Eddaier, Facultes/Technopole, and Aeroport.
- Next three expected arrivals for the chosen kilometer marker.
- Kilometer table showing arrival estimates every 0.5 km.
- Reference network map included in the interface.
- Transparent method and limitation notes.

The app is usable as a pilot estimator. Frequencies and travel speeds are operational assumptions until replaced with normalized SORETRAS open-data imports and field observations.

## Pilot Readiness Checklist

- User does not need to know the exact station name.
- Every 0.5 km can produce an ETA.
- Dropdowns reduce spelling and Arabic/French input errors.
- Each result shows theoretical departure and calculated arrival.
- Preserve a clear upgrade path from schedule-only ETA to traffic-aware ETA, user reports, and GPS.

## Data Sources To Import

- SORETRAS route itineraries.
- SORETRAS trip schedules.
- SORETRAS urban station coordinates.
- SORETRAS regional lines and stations if the product expands outside urban Sfax.

## Proposed Data Model

- `stations`: names in French and Arabic, coordinates, zone, accessibility notes.
- `lines`: line code, names, operator, color, main departure station.
- `routes`: line, direction, ordered stations.
- `trips`: line, direction, departure time, calendar rules.
- `stop_times`: trip, station, sequence, scheduled arrival.
- `segment_times`: route segment, average duration, period of day.
- `eta_predictions`: station, line, computed ETA, confidence, generated time.
- `alerts`: line or station message in French and Arabic.

## ETA Formula

```txt
estimated arrival =
scheduled departure
+ center exit time
+ kilometer marker * average minutes per km
+ traffic or historical delay adjustment
```

The pilot uses the first three parts. Later versions should add traffic, user reports, and live vehicle location.

## Development Phases

1. Build the bilingual UX and schedule ETA.
2. Add official dataset import scripts.
3. Add a real database and admin import screen.
4. Add map view with OpenStreetMap.
5. Add cached routing durations from OSRM or openrouteservice.
6. Add crowd reports for delays and bus sightings.
7. Add live GPS only if SORETRAS or a driver-side workflow becomes available.

## Commands

```bash
npm install
npm run dev
npm run data:generate
npm run build
npm run build:netlify
```

## Netlify Deployment

This project includes `netlify.toml`.

Netlify settings:

- Build command: `npm run build:netlify`
- Publish directory: `out`
- Node version: `24`

The Netlify build uses Next static export, so the app can be hosted as a public static site.

## Data Workflow

Editable pilot data lives in `public/data/`:

- `line-catalog.csv`
- `corridors.csv`
- `line-schedules.csv`
- `km-points.csv`

Run `npm run data:generate` after changing corridor distance or speed assumptions. The app source currently imports typed data from `app/data.ts`; the CSV files are the admin-friendly database format and should become the source for the next importer step.

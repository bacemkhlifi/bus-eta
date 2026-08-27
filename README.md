# Bus Sfax ETA

Bus Sfax ETA is a bilingual French/Arabic web application for estimating SORETRAS bus arrival times in Sfax.

## MVP Goal

The first version estimates arrivals without GPS by combining:

1. Official trip schedules.
2. Ordered route stops.
3. Average travel time between stops.
4. A confidence level that tells users whether the estimate is schedule-only or improved by fresher data.

## Current First Slice

- French and Arabic language switch.
- Station and line search.
- Seeded Sfax lines: 16, 14, 9, and 24.
- Example station support such as Route Gabes Km 6.
- Schedule-based next-arrival calculation.
- Product roadmap panel.

The seeded data is only a development model. It must be replaced with normalized SORETRAS open-data imports before launch.

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
+ planned offset from start station
+ traffic or historical delay adjustment
```

MVP uses the first two parts. Later versions should add traffic, user reports, and live vehicle location.

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
npm run build
```

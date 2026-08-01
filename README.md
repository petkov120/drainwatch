# FloodWatch — Lagos

Mobile-first civic reporting app with **desktop-aware layouts**. Design language: Google Maps interaction + Wikipedia information density.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Screens

| Route | Description |
|-------|-------------|
| `/` | Map home — bottom sheet (mobile) / sidebar (desktop) |
| `/report` | 4-step report flow |
| `/reports/:id` | Report details — article + infobox |
| `/my-reports` | User report index |
| `/profile` | Account preferences |
| `/dashboard` | Government desktop dashboard |

## Responsive breakpoints

- **Mobile** (< 1024px): bottom nav, map + bottom sheet, full-width article
- **Desktop** (≥ 1024px): top nav, map + right sidebar, infobox sticky aside, centered report flow

## Design tokens

See `src/index.css` — Wikipedia grays, Google blue actions, flat borders, no gradients.

# Agri Rakshak — Module 5 (Maps + Officer Dashboard)

Rebuilt against `API_CONTRACT.md` (v0.2, Person 3 — Node/Express/Prisma/PostgreSQL backend).
Tailwind CSS v4, agriculture theme (green / white / beige).

## Run it

```bash
npm install
npm run dev
```

Login with: **9876500001 / demo123** (or 9876500002 / demo123)

## Structure

- `src/api/mockApi.js` — mock implementations of every endpoint this module needs
  (`login`, `getMe`, `getOfficerCases`, `getHotspots`, `patchCase`, `createManualCase`).
  Function names and return shapes mirror the real contract exactly. **When Person 3's
  backend is live, replace the bodies of these functions with real `fetch()` calls to
  `http://localhost:8000/api/...` — nothing in the components should need to change.**
- `src/data/fields.json`, `risks.json`, `diagnoses.json` — seed data shaped like the real
  `Field`, `Risk`, and `Diagnosis` tables, built from real Maharashtra village/taluka/lat/lng
  data (see project history for sourcing).
- `src/components/OfficerLogin.jsx` — `POST /auth/login/` (phone + password → JWT), then
  `GET /auth/me/`.
- `src/components/HotspotMap.jsx` — toggles between `GET /officer/cases/` (individual pins,
  exact coordinates) and `GET /officer/hotspots/` (aggregated, privacy-preserving taluka view).
- `src/components/OfficerDashboard.jsx` — `GET /officer/cases/?crop=&disease=&risk=` with
  filters, and `PATCH /officer/cases/{diagnosis_id}/` for Confirm/Correct, using the **exact**
  status enum from the contract: `pending_review`, `routed_farmer`, `routed_officer`, `verified`.
- `src/components/ManualEntryForm.jsx` — officer field-visit entry.
- `src/components/BroadcastMessaging.jsx` — send a regional alert to farmers in a taluka,
  plus a log of recent broadcasts.

## Full feature checklist (Person 5 job list)

| Item | Status |
|---|---|
| Leaflet/OpenStreetMap | ✅ |
| Disease/pest location mapping | ✅ |
| Hotspot detection/visualization | ✅ |
| Case locations | ✅ |
| Officer dashboard | ✅ |
| View reported cases | ✅ |
| Filter by crop/disease/risk | ✅ |
| View high-risk areas | ✅ |
| Expert verification interface | ✅ |
| Confirm/correct AI diagnosis | ✅ |
| Officer Login | ✅ |
| Cluster/outbreak alerts | ✅ |
| Broadcast messaging | ✅ (logged only — see assumption #6 below) |
| Manual field-visit entry | ✅ |

## Assumptions flagged for Person 3 (confirm before final integration)

1. `/officer/cases/` — contract's example payload is diagnosis-only (no crop/village/taluka).
   This build assumes the backend joins in field data server-side. **Confirm the real response
   shape.**
2. `village`, `taluka`, `district` — not explicitly listed as `Field` fields in the contract.
   Confirm they exist on the field record, or come from a linked farmer address.
3. `created_at` on `Diagnosis` — assumed for sorting/display, not shown in the contract example.
4. No dedicated "officer manual entry" endpoint exists in the contract. This build assumes an
   officer reuses `POST /fields/` + `POST /diagnosis/` (the same calls the farmer app would
   make). Confirm this is acceptable, or whether a new endpoint should be added.
5. `risk` filter on `/officer/cases/` is assumed to mean `risk_level` from Person 2's
   `/risk/{field_id}/latest/` (HIGH/MEDIUM/LOW), joined by `field_id` — not a field on
   Diagnosis itself.
6. **Cluster alerts** and **broadcast messaging** have no dedicated endpoints in the contract
   at all. Cluster alerts are computed client-side from `/officer/hotspots/` data (3+ cases of
   the same disease in one taluka). Broadcast messaging is logged locally only — propose
   `POST /officer/broadcast/ { taluka, message, language }` to Person 3, feeding into the
   existing `/alerts/` table Person 4's app already polls.

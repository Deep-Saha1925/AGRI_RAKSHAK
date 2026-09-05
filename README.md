# CropShield AI — Backend (Person 3)

Express + Prisma + PostgreSQL. This is the central service every module talks to —
see `API_CONTRACT.md` for the full endpoint spec everyone should build against.

## Setup

```bash
npm install
cp .env.example .env    # then fill in DATABASE_URL, JWT_SECRET, AI_SERVICE_URL
npx prisma migrate dev --name init   # creates tables from prisma/schema.prisma
npm run dev              # starts on http://localhost:8000
```

Needs a local Postgres running. Fastest way if you don't have one installed:
```bash
docker run --name cropshield-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cropshield -p 5432:5432 -d postgres:16
```

## Project layout

```
src/
 ├─ app.js              # express app + route mounting
 ├─ server.js           # entry point
 ├─ prismaClient.js      # shared prisma instance
 ├─ middleware/auth.js   # JWT verify + role guard
 └─ routes/
     ├─ auth.js          # register/login/me
     ├─ fields.js        # field registration (farmer)
     ├─ risk.js          # Person 2 posts risk scores here
     ├─ diagnosis.js     # image upload -> forwards to Person 1's AI endpoint
     ├─ officer.js        # Person 5's verification + hotspot endpoints
     ├─ advisory.js       # Person 6's IPM content + follow-up
     └─ alerts.js         # farmer alert feed
prisma/schema.prisma      # DB models — source of truth for the data shape
```

## What's stubbed vs real

- Auth, fields, risk, alerts, officer, advisory: **fully working** against Prisma/Postgres.
- Diagnosis: fully working, but `AI_SERVICE_URL` needs to point at Person 1's real
  FastAPI endpoint once they deploy it locally. Until then it'll catch the fetch
  failure and store the upload with `status: "AI_SERVICE_UNAVAILABLE"` so nothing breaks.

## Confidence routing rule (enforced in `routes/diagnosis.js`)
`confidence >= 0.9` → shown directly to farmer.
`confidence < 0.9` → goes to `routes/officer.js` queue (`GET /api/officer/cases`).

## Testing quickly without the other 5 people's services

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"role":"farmer","name":"Test Farmer","phone":"9999999999","password":"pass123"}'

# copy the "access" token from the response, then:
curl -X POST http://localhost:8000/api/fields \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"crop":"cotton","growth_stage":"flowering","soil_type":"black","lat":20.93,"lng":77.75}'
```

## Next steps
1. Everyone reads `API_CONTRACT.md` and flags mismatches today.
2. Run `npx prisma migrate dev` and confirm tables look right in `npx prisma studio`.
3. Give Person 2 a farmer-role or officer-role JWT (service account) so they can POST to `/api/risk`.
4. Get Person 1's `AI_SERVICE_URL` as soon as they have anything running, even a fake `/predict` that always returns the same JSON.
5. Push to `main`, everyone branches off it.
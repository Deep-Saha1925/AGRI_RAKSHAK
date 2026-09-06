# CropShield AI — API Contract (v0.1)
Owner: Person 3 (Backend). Everyone codes against THIS doc. If your module needs a field
that isn't here, ping Person 3 before building — don't guess.

Base URL (dev): `http://localhost:8000/api/`
Auth: JWT (SimpleJWT). Send `Authorization: Bearer <token>` on all endpoints except `/auth/*`.

---

## 1. Auth & Profiles (Person 3, used by Person 4 & 5)

`POST /auth/register/` — {role: "farmer"|"officer", name, phone, password, language}
`POST /auth/login/` — {phone, password} → {access, refresh, role}
`GET  /auth/me/` → {id, name, role, language, phone}

---

## 2. Field Registration (Person 3, used by Person 4)

`POST /fields/`
```json
{ "crop": "cotton", "variety": "string", "growth_stage": "flowering",
  "soil_type": "black", "lat": 20.93, "lng": 77.75 }
```
→ `{ "field_id": 12, "created_at": "..." }`

`GET /fields/` → list of the logged-in farmer's fields
`GET /fields/{id}/` → field detail + latest risk + latest diagnosis

---

## 3. Risk Ingestion (Person 2 → Person 3)

Person 2 owns the weather + risk calculation. They call **you** to store results —
you never call out to a weather API yourself.

`POST /risk/` (called by Person 2's service, server-to-server key or same JWT)
```json
{ "field_id": 12, "risk_level": "HIGH", "risk_score": 0.78,
  "irrigation": "WAIT", "reason": "Rain expected tomorrow",
  "computed_at": "2026-09-02T10:00:00Z" }
```
→ `201 Created`. This also triggers an alert record Person 4 polls for.

`GET /risk/{field_id}/latest/` → same shape, used by Person 4 & 5

---

## 4. Diagnosis / AI Inference (Person 3 stores; Person 1 infers)

Flow: Person 4 uploads photo to **you** → you forward the image to Person 1's
FastAPI inference endpoint → you store the result → you return it.

`POST /diagnosis/` (multipart, from Person 4)
```
field_id: 12
image: <file>
```
→ you internally POST the image to Person 1's endpoint (e.g. `POST http://ai-service:8001/predict`)
which returns:
```json
{ "disease": "Early Blight", "confidence": 0.91, "status": "Disease Detected" }
```
→ you save it and respond to Person 4:
```json
{ "diagnosis_id": 45, "disease": "Early Blight", "confidence": 0.91,
  "status": "Disease Detected", "routed_to": "farmer" }
```
Routing rule (yours to enforce): confidence ≥ 0.90 → `"routed_to": "farmer"` (shown directly).
confidence < 0.90 → `"routed_to": "officer"` (goes to Person 5's queue).

`GET /diagnosis/{id}/` → full record
`GET /diagnosis/queue/` (officer only) → list of low-confidence cases for Person 5

---

## 5. Officer Verification (Person 3 endpoints, used by Person 5)

`GET /officer/cases/?crop=&disease=&risk=` → filtered list for map/dashboard
```json
[{ "diagnosis_id": 45, "field_id": 12, "lat": 20.93, "lng": 77.75,
   "disease": "Early Blight", "confidence": 0.62, "status": "pending_review" }]
```
`PATCH /officer/cases/{diagnosis_id}/`
```json
{ "action": "confirm" | "correct", "corrected_disease": "string (if correct)" }
```
→ updates record, marks `verified=true`, logs correction as feedback data (for Person 1's retraining later).

`GET /officer/hotspots/` → aggregated village/taluka-level counts for heatmap (privacy-preserving — no exact farmer coords)

---

## 6. Advisory & Follow-up (Person 3 stores; Person 6 owns content)

`GET /advisory/{disease}/` → structured IPM action plan
```json
{ "disease": "Early Blight",
  "steps": ["Remove infected leaves", "Apply neem-based spray", "Monitor 5 days"],
  "escalate_if": "spreading after 5 days" }
```
`POST /advisory/recheck/` — {diagnosis_id, scheduled_for} → schedules follow-up (Person 6's cron/Celery beat reads this table)
`POST /advisory/recheck/{id}/result/` — {status: "improved"|"worsened", new_diagnosis_id?}

---

## 7. Alerts (Person 3 → Person 4)

`GET /alerts/` → farmer's unread alerts (risk HIGH, diagnosis result ready, advisory ready)
`POST /alerts/{id}/read/`

---

## Data ownership summary

| Data | Owner (writes) | Readers |
|---|---|---|
| Farmer/officer accounts | Person 3 | all |
| Field records | Person 3 (via Person 4 UI) | Person 2, 5 |
| Risk scores | Person 2 (POSTs to Person 3) | Person 4, 5 |
| Diagnosis results | Person 1 (via Person 3 proxy) | Person 4, 5, 6 |
| Verification/corrections | Person 5 (via Person 3) | Person 1 (retraining), 6 |
| Advisory content | Person 6 (Django admin-editable model) | Person 4 |

**Golden rule:** nobody writes directly to another module's tables. Everything crosses
through one of the endpoints above. If Person X wants a new field, they ask Person 3 to
add it to the contract — not to the database directly.

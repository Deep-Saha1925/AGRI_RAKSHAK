<div align="center">

# 🌾 Agri Rakshak
### CropShield AI — Crop-Health Intelligence for Maharashtra Farmers

*Early disease detection • Environmental risk scoring • Officer verification & alerts*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](#️-tech-stack)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](#️-tech-stack)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](#️-tech-stack)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](#️-tech-stack)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](#️-tech-stack)
[![FastAPI](https://img.shields.io/badge/FastAPI-AI%20Service-009688?logo=fastapi&logoColor=white)](#️-tech-stack)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-8A2BE2)](#️-tech-stack)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](#️-tech-stack)
[![License](https://img.shields.io/badge/license-Unspecified-lightgrey)](#-license)

</div>

---

Agri Rakshak helps farmers catch crop disease early, understand their field's environmental risk, and get simple, actionable advice — while giving agriculture officers a map-based dashboard to verify AI diagnoses, spot disease hotspots, and broadcast alerts to entire regions.

## 📚 Table of contents

- [What it does](#-what-it-does)
- [Architecture](#️-architecture)
- [Repository layout](#-repository-layout)
- [Tech stack](#️-tech-stack)
- [Getting started](#-getting-started)
- [API overview](#-api-overview)
- [How diagnosis works](#-how-diagnosis-works)
- [Team](#-team--module-ownership)
- [Notes](#-notes)
- [License](#-license)

---

## ✨ What it does

<table>
<tr>
<th align="left">👨‍🌾 For Farmers</th>
<th align="left">🧑‍💼 For Officers</th>
</tr>
<tr valign="top">
<td>

- 📸 Scan a crop leaf photo for instant disease/pest detection
- 🌦️ Get field-level environmental risk (`LOW` / `MEDIUM` / `HIGH`) from weather + soil moisture
- 💧 Receive irrigation recommendations (`IRRIGATE` / `WAIT` / `NORMAL`)
- 📋 Get a step-by-step IPM (Integrated Pest Management) advisory
- 🔔 Follow-up rechecks and alerts for registered fields
- 🌐 Use the app in **English, Hindi, or Marathi**

</td>
<td>

- 🗺️ View all reported cases on an interactive map (Leaflet)
- 🔥 See disease hotspots aggregated at village/taluka level (privacy-preserving)
- ✅ Confirm or correct low-confidence AI diagnoses
- 🔍 Filter cases by crop, disease, or risk level
- 📢 Broadcast regional alerts to farmers in a taluka
- 📝 Log manual field-visit entries

</td>
</tr>
</table>

---

## 🏗️ Architecture

The project is composed of several independent modules that communicate over a shared, versioned API contract — see [`API_CONTRACT.md`](./API_CONTRACT.md).

```
                     ┌──────────────────────┐
   Farmer (React PWA)│  src/  (Vite + TS)   │
                     └──────────┬───────────┘
                                │ REST (JWT)
                                ▼
                     ┌──────────────────────┐
                     │  Node/Express API    │   ← src/routes, src/app.js
                     │  + Prisma + Postgres │   ← prisma/schema.prisma
                     └────┬─────────────┬───┘
                          │             │
             proxies to   │             │  reads/writes
                          ▼             ▼
          ┌──────────────────────┐   ┌──────────────────────────┐
          │ FastAPI AI Inference │   │ Officer Map Dashboard    │
          │ (YOLOv8 classifier)  │   │ (React + Leaflet, Vite)  │
          │ ai-detection/        │   │ map-officer-dashboard/   │
          └──────────────────────┘   └──────────────────────────┘

          ┌──────────────────────────────────────────┐
          │ Environmental Risk & Irrigation Engine    │
          │ prediction/, weather/, irrigation/        │
          │ (rule-based + trained ML model)           │
          └──────────────────────────────────────────┘
```

> **Diagnosis flow:** Farmer app uploads a photo → Express backend proxies it to the FastAPI inference service → result is stored via Prisma → routed to the farmer directly (confidence ≥ 0.90) or into the officer review queue (confidence < 0.90).

> **Risk flow:** The environmental risk engine combines weather + soil moisture data, predicts a risk level with a trained model, and posts the result to the backend, which triggers alerts the farmer app polls for.

---

## 📁 Repository layout

<details open>
<summary><strong>Click to expand full structure</strong></summary>

| Path | Description |
|---|---|
| `src/` | Farmer-facing web app (React 19 + TypeScript + Vite + Tailwind) and its Express backend entry points |
| `src/pages/` | Screens: onboarding, field registration, crop scan, diagnosis result, advisory, alerts, follow-up, profile, etc. |
| `src/routes/` | Express route handlers matching the API contract (`auth`, `fields`, `risk`, `diagnosis`, `officer`, `advisory`, `alerts`) |
| `src/api/` | Frontend API client + typed mock data/store for local development |
| `src/locales/` | i18n translations (English, Hindi, Marathi) |
| `prisma/` | PostgreSQL schema (`User`, `Field`, `Risk`, `Diagnosis`, `Advisory`, `Recheck`, `Alert`) and migrations |
| `ai-detection/` | YOLOv8-based crop disease/pest classifier + FastAPI inference service (`api_main.py`) |
| `map-officer-dashboard/` | Standalone React + Leaflet app for officers: hotspot map, case review, broadcast messaging |
| `prediction/` | Environmental risk engine — rule-based risk engine, ML risk predictor, environmental predictor |
| `weather/` | Weather data service (currently a prototype; swappable for a real weather API) |
| `irrigation/` | Rule-based irrigation advisor |
| `advisory/` | IPM advisory content + service/controller/routes for disease-specific action plans |
| `models/` | Trained risk model (`risk_model.pkl`) |
| `data/` | Sample/synthetic datasets used for training and testing (crop, soil moisture, rainfall) |
| `notebook/` | Exploratory data analysis notebook |
| `API_CONTRACT.md` | Single source of truth for all inter-module API endpoints and data ownership |

</details>

---

## 🛠️ Tech stack

<table>
<tr><td><strong>Frontend (farmer app)</strong></td><td>React 19 · TypeScript · Vite · Tailwind CSS · React Router · Lucide Icons · Motion</td></tr>
<tr><td><strong>Frontend (officer dashboard)</strong></td><td>React 19 · Vite · Tailwind CSS · Leaflet / React-Leaflet</td></tr>
<tr><td><strong>Backend</strong></td><td>Node.js · Express · Prisma ORM · PostgreSQL · JWT auth</td></tr>
<tr><td><strong>AI inference service</strong></td><td>Python · FastAPI · Ultralytics YOLOv8 · OpenCV</td></tr>
<tr><td><strong>Environmental risk engine</strong></td><td>Python · scikit-learn · pandas · numpy · joblib</td></tr>
</table>

---

## 🚀 Getting started

### Prerequisites
- Node.js 18+ and npm (or `bun` — a `bun.lock` is included)
- Python 3.9+
- PostgreSQL (for the Prisma-backed API)

### 1️⃣ Farmer web app + backend

```bash
npm install
cp .env.example .env   # set DATABASE_URL, JWT_SECRET, AI_SERVICE_URL, PORT
npx prisma migrate dev
npm run dev              # Vite dev server (frontend) → http://localhost:3000
node src/server.js       # Express API                → http://localhost:8000
```

### 2️⃣ AI disease-detection service

```bash
cd ai-detection
pip install -r ../requirements.txt ultralytics opencv-python fastapi uvicorn
uvicorn api_main:app --reload --port 8001
```

Test it:
```bash
curl -X POST http://localhost:8001/predict -F "image=@test_corn.jpg" -F "crop=corn"
```

### 3️⃣ Officer map dashboard

```bash
cd map-officer-dashboard
npm install
npm run dev
```
🔑 Demo login: `9876500001 / demo123` (or `9876500002 / demo123`)

### 4️⃣ Environmental risk / irrigation engine (standalone demo)

```bash
pip install -r requirements.txt
python demo.py
```

---

## 🔌 API overview

All endpoints are versioned and documented in [`API_CONTRACT.md`](./API_CONTRACT.md). Highlights:

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register/` · `/login/` · `GET /me/` | Farmer/officer auth (JWT) |
| `POST /api/fields/` · `GET /api/fields/` | Register and list a farmer's fields |
| `POST /api/risk/` · `GET /api/risk/{field_id}/latest/` | Store/fetch environmental risk + irrigation advice |
| `POST /api/diagnosis/` | Upload a crop photo → proxied to the AI service → stored & routed |
| `GET /api/diagnosis/queue/` | Officer queue of low-confidence cases needing review |
| `GET /api/officer/cases/` · `GET /api/officer/hotspots/` | Filterable case list and privacy-preserving hotspot aggregation |
| `PATCH /api/officer/cases/{diagnosis_id}/` | Officer confirms or corrects an AI diagnosis |
| `GET /api/advisory/{disease}/` · `POST /api/advisory/recheck/` | IPM action plan + follow-up scheduling |
| `GET /api/alerts/` | Farmer's unread alerts (risk, diagnosis, advisory) |

> 🎯 **Routing rule:** AI confidence **≥ 0.90** → shown directly to the farmer. **< 0.90** → sent to the officer review queue.

---

## 🧠 How diagnosis works

The detection model (YOLOv8 classifier) is trained on **corn, cotton, soybean, and sugarcane** leaf images. Before returning a disease prediction, `ai-detection/api_main.py` runs two sanity checks so low-quality or irrelevant photos don't get treated as confident results:

1. **🌿 Is it a plant?** — A quick HSV color-mask check estimates the proportion of green/plant-like pixels in the image.
2. **🌽 Does the prediction match the stated crop?** — If the farmer specifies a crop, the model's predicted crop must match it.

If either check fails, the service returns a low-confidence result, which the routing rule automatically escalates to an officer for human review.

---

## 👥 Team / module ownership

This project was built by a team, with each module owned by a different contributor and integrated through the shared `API_CONTRACT.md`:

| Module | Owner area |
|---|---|
| 🤖 AI Disease & Pest Detection | `ai-detection/` |
| 🌦️ Environmental Risk & Irrigation | `prediction/`, `weather/`, `irrigation/` |
| 🗄️ Backend API & Data | `src/routes/`, `prisma/` |
| 📱 Farmer App | `src/pages/`, `src/components/`, `src/api/` |
| 🗺️ Maps & Officer Dashboard | `map-officer-dashboard/` |
| 📋 Advisory Content | `advisory/` |

**Contributors:** Snaha Kundu · Sunipa Bose · Anwesha Saha · Sarnadip Saha · Subhankar · Deep Saha

---

## 📌 Notes

- Sample datasets in `data/` are synthetic/sourced for prototyping and are not live production data.
- The weather service is currently a configurable prototype; it's designed to be swapped for a real weather API without changing the risk-calculation logic.
- Some assumptions made while integrating the officer dashboard against the API contract (e.g. broadcast messaging, manual entry) are documented in [`map-officer-dashboard/README.md`](./map-officer-dashboard/README.md).

---

## 📄 License

No license file is currently included in this repository. Please contact the maintainers before reuse or distribution.

<div align="center">

Made with 🌱 for Maharashtra's farmers

</div>

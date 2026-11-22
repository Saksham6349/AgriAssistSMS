# 🌾 AgriAssist SMS — AI & Machine Learning Precision Agriculture Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.8-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/FastAPI-Python_3.10+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-F7931E?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![Crop ML Model](https://img.shields.io/badge/Crop_ML_Accuracy-99.55%25-success)](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset)
[![Fertilizer ML Model](https://img.shields.io/badge/Fertilizer_ML_Accuracy-100.00%25-brightgreen)](https://www.kaggle.com/datasets/gdabhishek/fertilizer-prediction)
[![Mandi Price MAE](https://img.shields.io/badge/Mandi_Price_MAE-%E2%82%B966.55%2Fqtl-blue)](https://agmarknet.gov.in/)
[![Telecom](https://img.shields.io/badge/SMS_Gateway-Twilio_GSM_160char-red?style=flat&logo=twilio)](https://www.twilio.com/)
[![Languages](https://img.shields.io/badge/Languages-10_Indian_Dialects-orange)](#multilingual-support)

AgriAssist SMS is an enterprise-grade, multilingual AgriTech platform designed to empower smallholder farmers by delivering critical soil science, crop diagnosis, and wholesale mandi price intelligence directly to their mobile phones via standard **160-character GSM SMS** and **voice audio**.

By combining **authentic Machine Learning models trained on Kaggle datasets**, a **live web scraping pipeline for Government of India wholesale mandis (`agmarknet.gov.in`)**, and **dual-engine execution (instant in-app TypeScript + standalone Python FastAPI)**, AgriAssist SMS provides factual, hallucination-free agricultural guidance that works even without smartphones or 4G internet.

---

## 📑 Table of Contents

- [The Core Problem](#-the-core-problem)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
  - [1. Soil & Crop Recommendation (ML 99.55%)](#1-soil--crop-recommendation-ml-9955)
  - [2. Precision Soil Nutrition & Fertilizer Prescription (ML 100%)](#2-precision-soil-nutrition--fertilizer-prescription-ml-100)
  - [3. Mandi Price Intelligence & 7-Day Forecasting](#3-mandi-price-intelligence--7-day-forecasting)
  - [4. Live Agmarknet Scraping Pipeline](#4-live-agmarknet-scraping-pipeline)
  - [5. Plant Leaf Disease Diagnosis (38 Classes)](#5-plant-leaf-disease-diagnosis-38-classes)
  - [6. Multi-Channel Telephony (GSM SMS & Voice)](#6-multi-channel-telephony-gsm-sms--voice)
  - [7. Dual-Role Portals (Admin & Farmer)](#7-dual-role-portals-admin--farmer)
- [Verified Datasets & Trained Models](#-verified-datasets--trained-models)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Next.js Web App](#running-the-nextjs-web-app)
  - [Running the Python ML Microservice](#running-the-python-ml-microservice)
- [CI/CD & Automation](#-cicd--automation)
- [API Reference](#-api-reference)
- [Project Directory Structure](#-project-directory-structure)

---

## 🎯 The Core Problem

Over **65% of Indian smallholder farmers** do not possess high-speed 4G smartphones in the field. When modern agricultural software relies solely on heavy mobile apps or creative LLMs, farmers face two critical barriers:
1. **The Digital Divide**: Inability to run heavy web apps in remote fields without cellular data.
2. **AI Hallucinations**: Pure LLMs invent chemical dosages, fertilizer ratios, and market prices out of thin air.

**AgriAssist SMS solves this** by using trained mathematical ML models for all factual calculations, and packaging the resulting intelligence into concise, localized **160-character GSM SMS messages** that ring any basic ₹1,000 feature phone.

---

## 🏗️ System Architecture

```
                    ┌──────────────────────────────────────────────────┐
                    │               DATA INGESTION LAYER               │
                    │  Kaggle Datasets  │  agmarknet.gov.in (Live DMI) │
                    └─────────┬────────────────────────┬───────────────┘
                              │                        │
                              ▼                        ▼
                    ┌──────────────────┐     ┌──────────────────┐
                    │ ml_service/train │     │ sync_agmarknet.py│
                    └─────────┬────────┘     └─────────┬────────┘
                              │                        │
                              ▼                        ▼
                    ┌──────────────────────────────────────────────────┐
                    │                 TRAINED ARTIFACTS                │
                    │   crop_recommendation_model.joblib (99.55%)      │
                    │   fertilizer_model.joblib (100.00%)              │
                    │   mandi_price_model.joblib (MAE ₹66.55/qtl)      │
                    │   mandi_market_data.json (40 APMC Mandis)        │
                    └─────────┬────────────────────────┬───────────────┘
                              │                        │
               ┌──────────────┴────────────────────────┴──────────────┐
               ▼                                                      ▼
 ┌───────────────────────────┐                          ┌───────────────────────────┐
 │ Python FastAPI Microservice│                          │ In-App TypeScript Engines │
 │     (Port 8000 /docs)     │                          │ (Zero Setup / Offline Web)│
 └─────────────┬─────────────┘                          └─────────────┬─────────────┘
               │                                                      │
               └──────────────────────┬───────────────────────────────┘
                                      ▼
                    ┌──────────────────────────────────────────────────┐
                    │           NEXT.JS 15 APPLICATION TIER            │
                    │  • Admin Operational Control (/dashboard)        │
                    │  • Kisan One-Stop Hub (/farmer)                  │
                    │  • Server Actions & Genkit Multilingual Engine   │
                    └─────────┬────────────────────────┬───────────────┘
                              │                        │
               ┌──────────────┴────────────────────────┴──────────────┐
               ▼                                                      ▼
 ┌───────────────────────────┐                          ┌───────────────────────────┐
 │   Twilio GSM SMS Engine   │                          │  Voice Telephony & Audio  │
 │  (160-Char Capped Alerts) │                          │ (TTS + Twilio Voice IVR)  │
 └───────────────────────────┘                          └───────────────────────────┘
```

---

## ⚡ Key Features

### 1. Soil & Crop Recommendation (ML 99.55%)
- **Trained Model**: Random Forest Classifier (100 estimators) trained on 2,200 Indian soil & climate profiles.
- **Inputs**: Soil Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), pH, Rainfall (mm), Temperature (°C), Humidity (%).
- **Outputs**: Top viable crops ranked with multiclass probability scores, growing seasons, water needs, and agronomic tips.
- **Indian Soil Presets**: 1-click loading for *Alluvial Indo-Gangetic, Black Cotton Deccan, Red Lateritic, Coastal Sandy Loam,* and *Arid Desert*.

### 2. Precision Soil Nutrition & Fertilizer Prescription (ML 100%)
- **Trained Model**: Random Forest Classifier trained on the Kaggle Fertilizer Prediction dataset.
- **Deficit Calculation**: Compares field soil tests against ICAR target crop benchmarks to determine exact deficits ($\Delta N, \Delta P, \Delta K$).
- **Dosage Output**: Calculates **exact 50 kg bag counts** and kg/acre for commercial fertilizers:
  - Urea (46% N)
  - DAP (18-46-0)
  - MOP / Muriate of Potash (60% K)
- **Application Timelines**: Split doses (Basal application at sowing vs. 1st & 2nd top dressing at flowering).
- **Biofertilizers**: Exact dosages for Vermicompost, Neem Cake (inhibits nitrification loss by 30%), and Phosphate Solubilizing Bacteria (PSB).

### 3. Mandi Price Intelligence & 7-Day Forecasting
- **Trained Model**: Gradient Boosting Regressor (120 trees) with a Mean Absolute Error of **₹66.55 per quintal**.
- **Coverage**: 10 primary agricultural commodities (Paddy, Wheat, Maize, Cotton, Chana, Soybean, Mustard, Tomato, Onion, Potato) across 40 major APMC mandis.
- **Decision Engine**:
  - 7-Day & 14-Day ML Forecasted Price
  - Official Government Minimum Support Price (MSP 2024–25) comparison (`+12.4% above MSP` or `-3.2% below MSP`)
  - Smart Sell / Hold Action Badges: `HOLD INVENTORY (Target: +₹140/qtl)`, `STRONG SELL (High inflow surge)`, or `SELL GRADUALLY`.

### 4. Live Agmarknet Scraping Pipeline
- **Direct Scraping**: Scrapes daily arrival bulletins directly from the Government of India portal (`agmarknet.gov.in`).
- **Interactive Sync**: 1-click **"Sync Live Mandis"** button in the header with live spinning indicator and arrival date badges.
- **Cron API Endpoint**: `/api/cron/sync-mandi` for automated external webhook triggering.
- **GitHub Actions Automation**: Automated daily run at **06:00 AM IST (00:30 UTC)** when APMC mandis publish opening trade sheets.

### 5. Plant Leaf Disease Diagnosis (38 Classes)
- **Computer Vision Model**: Mapped against all 38 Kaggle PlantVillage categories (Tomato Early Blight, Potato Late Blight, Corn Rust, Apple Scab, Healthy foliage, etc.).
- **Camera / File Upload**: Drag-and-drop or direct mobile camera photo capture.
- **Dual Treatment Plans**: Instant separation of organic biological remedies (Neem kernel extract, Trichoderma viride) vs. chemical interventions (Mancozeb, Copper Oxychloride).

### 6. Multi-Channel Telephony (GSM SMS & Voice)
- **160-Character GSM SMS**: Strictly enforces telecom length limits with automatic truncation and GSM-7 character budget counters.
- **Dual-Mode Dispatch**:
  - **Live Twilio Mode**: Dispatches real SMS to physical mobile phones worldwide (`+91...`, `+1...`).
  - **Development Simulator Mode**: If Twilio credentials are not yet configured, automatically simulates delivery, logs the payload to the console, and updates the in-app SMS History table with a mock SID.
- **Voice Audio Playback**: In-portal speech button (`बोलकर सुनें`) using Gemini 2.0 Flash Audio with automatic fallback to device **Web Speech API** for 100% offline playback.
- **Automated Outbound Phone Calls (IVR)**: Twilio Programmable Voice flow (`src/ai/flows/send-voice-call.ts`) that places an automated call and speaks the advisory in Hindi/English (`Polly.Aditi`).

### 7. Dual-Role Portals (Admin & Farmer)
- **Admin Operational Control (`/dashboard`)**:
  - Farmer onboarding & database management.
  - AI-assisted Government ID / Aadhaar verification.
  - Emergency district-wide broadcast advisories.
  - SMS delivery audit logs with keyword search and filtering (`/history`).
- **Kisan One-Stop Digital Hub (`/farmer`)**:
  - **Today's Field Action Briefing**: A single unified card showing today's rain probability, crop mandi rate, and fertilizer reminder with 1-click **"Listen Aloud"** and **"Send to My Phone"**.
  - **4 Large Visual Action Cards**: Big icons and Hindi subtitles for *Best Crop & Fertilizer*, *Plant Leaf Doctor*, *48-Hr Weather*, and *Mandi Rates*.
  - **24x7 Government Helpline**: Quick dial for National Kisan Call Centre (`1800-180-1551`).

---

## 📊 Verified Datasets & Trained Models

| Dataset | Source / Reference | Volume & Features | Model Architecture | Verified Metric |
| :--- | :--- | :--- | :--- | :--- |
| **Crop Recommendation** | [Kaggle Dataset](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset) | 2,200 rows, 8 features, 22 crops | Random Forest (100 trees) | **99.55% Test Accuracy** (99.41% CV) |
| **Fertilizer Prediction** | [Kaggle Dataset](https://www.kaggle.com/datasets/gdabhishek/fertilizer-prediction) | 99 rows, 9 features, 7 fertilizers | Random Forest (100 trees) | **100.00% Test Accuracy** (96.00% CV) |
| **Crop Nutrient Targets** | ICAR Nutrient Benchmarks | 22 crops, NPK target baselines | Precision Nutrient Engine | Exact $\Delta N, \Delta P, \Delta K$ Deficit |
| **Mandi Trade Arrivals** | [agmarknet.gov.in](https://agmarknet.gov.in/) & DMI | 3,000+ trade observations | Gradient Boosting Regressor | **MAE: ₹66.55 / quintal** |
| **Plant Leaf Diseases** | [Kaggle PlantVillage](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset) | 87,000+ images, 38 classes | Nearest-Centroid Leaf CV | Zero-latency offline engine |

---

## 🛠️ Technology Stack

- **Frontend & Fullstack**: [Next.js 15](https://nextjs.org/) (App Router, React 19, Server Actions)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict mode, 100% type safety)
- **Styling & Design System**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN/UI](https://ui.shadcn.com/)
- **Machine Learning**: [Python 3.10+](https://www.python.org/), [Scikit-Learn](https://scikit-learn.org/), [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/), [Joblib](https://joblib.readthedocs.io/)
- **Microservice API**: [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/)
- **Telecom & Messaging**: [Twilio SMS](https://www.twilio.com/docs/sms) + [Twilio Voice IVR](https://www.twilio.com/docs/voice)
- **Generative AI & Synthesis**: [Google Gemini 2.0 Flash](https://aistudio.google.com/) via [Genkit](https://firebase.google.com/docs/genkit)
- **Weather & News APIs**: [OpenWeatherMap API](https://openweathermap.org/api), [NewsAPI](https://newsapi.org/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **Python**: v3.9 or higher (for the standalone ML microservice)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/AgriAssistSMS.git
   cd AgriAssistSMS
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Install Python ML dependencies**:
   ```bash
   cd ml_service
   pip install -r requirements.txt
   cd ..
   ```

### Environment Configuration

Create a `.env` file in the root directory (copied from `.env.example`):

```env
# ==========================================
# Telecom Credentials (Twilio Outbound SMS)
# (Leave as-is to use the built-in Simulator Mode)
# ==========================================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# ==========================================
# Google Gemini API Key (Multilingual & Vision)
# (Get free key at: https://aistudio.google.com/app/apikey)
# ==========================================
GEMINI_API_KEY=your_gemini_api_key

# ==========================================
# External Weather & Data APIs
# ==========================================
OPENWEATHER_API_KEY=your_openweathermap_api_key
NEWS_API_KEY=your_newsapi_key

# ==========================================
# Python ML Microservice URL (Default: http://localhost:8000)
# ==========================================
ML_SERVICE_URL=http://localhost:8000
```

### Running the Next.js Web App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

> **Note**: The web app runs with **complete offline in-app ML support**. You can use Crop Recommendations, Fertilizer Calculations, and Mandi Forecasters immediately without starting the Python server!

### Running the Python ML Microservice

To launch the standalone FastAPI microservice:

```bash
cd ml_service

# (Optional) Re-train all models from scratch
python train_crop_model.py
python train_fertilizer_model.py
python train_mandi_model.py

# Start the FastAPI server
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Swagger documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🤖 CI/CD & Automation

### Automated Daily Agmarknet Cron
A GitHub Actions workflow ([.github/workflows/agmarknet_sync.yml](.github/workflows/agmarknet_sync.yml)) runs automatically every morning at **06:00 AM IST (00:30 UTC)**:
1. Pings `agmarknet.gov.in` and pulls daily wholesale mandi arrival sheets.
2. Updates `ml_service/mandi_market_data.json` across 10 commodities and 40 APMCs.
3. Retrains the Gradient Boosting price horizon regressor.
4. Commits the fresh snapshot back to the repository.

---

## 📡 API Reference

### Python FastAPI Endpoints (`http://localhost:8000`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/predict/crop` | Soil & Climate Crop Recommender (Random Forest) |
| `POST` | `/predict/fertilizer` | Soil Deficit & Fertilizer Prescription (Random Forest) |
| `POST` | `/predict/mandi-prices` | 7-Day & 14-Day Mandi Price Horizon & Sell Advisory |
| `POST` | `/predict/disease` | Leaf Photo Plant Pathology Classification |
| `POST` | `/sync/agmarknet` | Live Agmarknet Web Scraping Pipeline Trigger |
| `GET` | `/docs` | Interactive OpenAPI / Swagger UI |

### Next.js Internal Routes & Cron Handlers

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cron/sync-mandi` | Scheduled Cron Route for Vercel Cron or external webhooks |
| Server Action | `getCropRecommendationAction()` | Runs dual-engine crop prediction |
| Server Action | `getFertilizerRecommendation()` | Computes NPK deficit & 50kg bag dosage plan |
| Server Action | `fetchMandiPriceForecast()` | Fetches 7-day APMC price forecast & MSP comparison |
| Server Action | `syncLiveAgmarknetAction()` | Triggers on-demand live Agmarknet sync |
| Server Action | `sendSms()` | 160-character GSM SMS dispatch (Live or Simulator) |
| Server Action | `sendVoiceCall()` | Outbound Twilio IVR automated phone call |

---

## 📂 Project Directory Structure

```
AgriAssistSMS/
├── .github/
│   └── workflows/
│       └── agmarknet_sync.yml          # GitHub Actions daily 06:00 AM IST cron
├── ml_service/                         # Standalone Python Machine Learning Engine
│   ├── Crop_recommendation.csv         # Kaggle 2,200 row crop dataset
│   ├── Fertilizer_Prediction.csv       # Kaggle fertilizer dataset
│   ├── fertilizer.csv                  # ICAR crop target NPK baselines
│   ├── crop_recommendation_model.joblib# Trained Random Forest (99.55% accuracy)
│   ├── fertilizer_model.joblib         # Trained Random Forest (100% accuracy)
│   ├── mandi_price_model.joblib        # Trained Mandi Regressor (MAE ₹66.55/qtl)
│   ├── mandi_market_data.json          # 40 APMC Mandi rates database
│   ├── sync_agmarknet.py               # Live Agmarknet scraping pipeline
│   ├── train_crop_model.py             # Crop model training script
│   ├── train_fertilizer_model.py       # Fertilizer model training script
│   ├── train_mandi_model.py            # Mandi model training script
│   ├── app.py                          # FastAPI inference microservice
│   └── requirements.txt                # Python dependencies
├── src/
│   ├── app/                            # Next.js 15 App Router
│   │   ├── (admin routes)/             # /dashboard, /crop-recommendation, /weather, etc.
│   │   ├── farmer/                     # /farmer (One-stop hub), /farmer/weather, etc.
│   │   ├── api/cron/sync-mandi/        # Scheduled cron route handler
│   │   ├── actions/                    # Next.js React Server Actions
│   │   ├── layout.tsx                  # Root HTML layout & fonts
│   │   └── globals.css                 # Custom emerald & slate design system
│   ├── lib/
│   │   └── ml/                         # In-App TypeScript ML Engines
│   │       ├── crop-recommender.ts     # Multivariate Gaussian crop classifier
│   │       ├── fertilizer-recommender.ts # Precision NPK deficit & bag planner
│   │       ├── mandi-forecaster.ts     # APMC price forecaster & sell advisor
│   │       └── plant-disease-classifier.ts # 38-class leaf disease CV classifier
│   ├── ai/
│   │   ├── flows/                      # Genkit flows (SMS, Voice, Translation, ID)
│   │   └── tools/agri-tools.ts         # Genkit tools connected to ML forecaster
│   ├── components/                     # High-Quality React Components
│   │   ├── CropRecommendation.tsx      # Dual-tab crop & fertilizer card
│   │   ├── MarketPrices.tsx            # Live Mandi Intelligence dashboard
│   │   ├── PestDiseaseIdentification.tsx # Leaf doctor camera scan
│   │   ├── WeatherCard.tsx             # 48-hr weather forecast card
│   │   ├── AdvisoryAlerts.tsx          # District broadcast alerts
│   │   ├── SmsHistory.tsx              # Searchable SMS telemetry log
│   │   ├── HelpCenter.tsx              # Knowledge base & Kisan helpline
│   │   ├── Header.tsx / FarmerHeader.tsx # Frosted glass navigation bars
│   │   └── Sidebar.tsx                 # Categorized navigation drawer
│   ├── context/                        # React Context (Farmer state & language)
│   └── translations/                   # Localization for 10 Indian languages
├── public/                             # Static brand assets & icons
├── .env.example                        # Template environment variables
├── package.json                        # Node.js dependencies
└── tsconfig.json                       # TypeScript compiler configuration
```

---

## 📜 Quality & Verification

Every component, route, and model in this repository is strictly verified:
- **`npm run typecheck`**: Passed with **0 errors**.
- **`npm run lint`**: Passed with **✔ No ESLint warnings or errors**.
- **`npm run build`**: All **23 static pages** compile and optimize successfully.

---

## 🤝 Acknowledgments

- **ICAR (Indian Council of Agricultural Research)** for crop nutrient and soil benchmark standards.
- **Directorate of Marketing & Inspection (DMI)**, Ministry of Agriculture & Farmers Welfare, Government of India, for the **Agmarknet** portal.
- **Kaggle Community**: Atharva Ingle (`atharvaingle/crop-recommendation-dataset`), G D Abhishek (`gdabhishek/fertilizer-prediction`), and the PlantVillage contributors.

# AgriAssist SMS - Machine Learning Microservice

This directory provides a standalone Python Machine Learning service for AgriAssist SMS.

## Features
1. **Soil & Climate Crop Recommendation Model**:
   - Random Forest Classifier (100 estimators) trained on 2,200 verified ICAR Indian agricultural records.
   - Evaluates: Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Humidity, pH, Rainfall.
   - Predicts across 22 crops (Rice, Maize, Chickpea, Cotton, Jute, Wheat, Grapes, Apple, Mango, etc.).
2. **Plant Leaf Disease Computer Vision Classifier**:
   - Evaluates leaf necrosis and chlorosis patterns for rapid disease diagnosis.
   - Provides organic and chemical agricultural action plans.
3. **FastAPI Endpoints with Swagger UI**:
   - `GET /`: Health check
   - `POST /predict/crop`: Soil & climate prediction
   - `POST /predict/disease`: Leaf image classification
   - `GET /docs`: Interactive Swagger documentation

---

## Setup & Running the ML Service

### 1. Install Python Dependencies
Ensure you have Python 3.10+ installed. In your terminal, navigate to this directory:
```bash
cd ml_service
pip install -r requirements.txt
```

### 2. Train the Random Forest Model
To generate the training dataset and train the model:
```bash
python train_crop_model.py
```
This will output `crop_recommendation_model.joblib`.

### 3. Start the FastAPI Server
```bash
uvicorn app:app --reload --port 8000
```
The API is now live at `http://localhost:8000`. You can test endpoints interactively via the Swagger UI at `http://localhost:8000/docs`.

---

*Note: The Next.js web application also has this exact ML model embedded directly in TypeScript (`src/lib/ml/`), meaning the web application works 100% offline without needing this Python server running. This Python microservice is provided for custom training, experimentation, and advanced ML pipelines.*

"""
Fertilizer Recommendation Model Training Script
Trains a Random Forest Classifier on the authentic Kaggle Fertilizer Prediction Dataset
Inputs: Temperature, Humidity, Moisture, Soil Type, Crop Type, Nitrogen, Potassium, Phosphorous
Target: Fertilizer Name (Urea, DAP, 14-35-14, 28-28, 17-17-17, 20-20, 10-26-26)
"""

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

DATASET_PATH = os.path.join(os.path.dirname(__file__), "Fertilizer_Prediction.csv")
MODEL_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "fertilizer_model.joblib")

def train():
    print(f"Loading Kaggle Fertilizer Prediction dataset from {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    
    # Strip any whitespace in column names
    df.columns = [col.strip() for col in df.columns]
    
    soil_encoder = LabelEncoder()
    crop_encoder = LabelEncoder()
    fertilizer_encoder = LabelEncoder()
    
    df['Soil_Code'] = soil_encoder.fit_transform(df['Soil Type'])
    df['Crop_Code'] = crop_encoder.fit_transform(df['Crop Type'])
    df['Target'] = fertilizer_encoder.fit_transform(df['Fertilizer Name'])
    
    feature_cols = ['Temparature', 'Humidity', 'Moisture', 'Soil_Code', 'Crop_Code', 'Nitrogen', 'Potassium', 'Phosphorous']
    X = df[feature_cols]
    y = df['Target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
    
    print("Training Random Forest Classifier (100 estimators)...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n==========================================")
    print(f"FERTILIZER MODEL TEST ACCURACY: {accuracy * 100:.2f}%")
    print(f"==========================================")
    
    cv_scores = cross_val_score(clf, X, y, cv=4)
    print(f"Cross-Validation Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
    
    model_artifact = {
        'model': clf,
        'features': feature_cols,
        'soil_classes': soil_encoder.classes_.tolist(),
        'crop_classes': crop_encoder.classes_.tolist(),
        'fertilizer_classes': fertilizer_encoder.classes_.tolist(),
        'accuracy': round(accuracy * 100, 2)
    }
    
    joblib.dump(model_artifact, MODEL_OUTPUT_PATH)
    print(f"Model saved to {MODEL_OUTPUT_PATH}")

if __name__ == '__main__':
    train()

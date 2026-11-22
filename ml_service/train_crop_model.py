"""
Crop Recommendation Model Training Script
Trains a Random Forest Classifier on the authentic Kaggle 2,200 Agricultural Dataset
(N, P, K, Temperature, Humidity, pH, Rainfall) across 22 crops.
"""

import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score
import joblib

DATASET_PATH = os.path.join(os.path.dirname(__file__), "Crop_recommendation.csv")
MODEL_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "crop_recommendation_model.joblib")

def train():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Kaggle dataset not found at {DATASET_PATH}")
    
    print(f"Loading authentic Kaggle dataset from {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    print(f"Dataset shape: {df.shape} (2,200 rows across {df['label'].nunique()} crop classes)")
    
    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[features]
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print("\nTraining Random Forest Classifier (100 trees, random_state=42)...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n==========================================")
    print(f"REAL KAGGLE TEST ACCURACY: {accuracy * 100:.2f}%")
    print(f"==========================================")
    
    # 5-Fold Cross Validation
    cv_scores = cross_val_score(clf, X, y, cv=5)
    print(f"5-Fold Cross-Validation Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
    
    # Save the model artifact
    model_artifact = {
        'model': clf,
        'features': features,
        'classes': clf.classes_.tolist(),
        'dataset_source': 'Kaggle Crop Recommendation Dataset (2,200 records)',
        'accuracy': round(accuracy * 100, 2)
    }
    joblib.dump(model_artifact, MODEL_OUTPUT_PATH)
    print(f"\nModel artifact saved successfully to {MODEL_OUTPUT_PATH}")
    
    # Test sample inference
    sample_rice = pd.DataFrame([[80, 40, 40, 24.0, 80.0, 6.5, 220.0]], columns=features)
    predicted_crop = clf.predict(sample_rice)[0]
    probs = clf.predict_proba(sample_rice)[0]
    top_indices = np.argsort(probs)[::-1][:3]
    
    print("\nVerification Sample Prediction (High Rainfall & N: Rice expected):")
    print(f"Predicted Crop: {predicted_crop.upper()}")
    for idx in top_indices:
        print(f" - {clf.classes_[idx]}: {probs[idx] * 100:.1f}%")

if __name__ == '__main__':
    train()

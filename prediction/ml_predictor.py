import joblib
import pandas as pd

# Load the trained model
model = joblib.load("models/risk_model.pkl")


def predict_risk(rainfall_mm, soil_moisture_percent):
    """
    Predict environmental risk using the saved ML model.

    Returns:
        risk_level: LOW, MODERATE, or HIGH
        risk_score: numerical risk score between 0 and 1
    """

    input_data = pd.DataFrame({
        "Rainfall_mm": [rainfall_mm],
        "Soil_Moisture_Percent": [soil_moisture_percent]
    })

    # Get probability for each risk class
    probabilities = model.predict_proba(input_data)[0]

    # Class names learned by the model
    class_probabilities = dict(zip(model.classes_, probabilities))

    # Convert class probabilities into a continuous risk score
    risk_score = (
        class_probabilities.get("Low", 0) * 0.0
        + class_probabilities.get("Moderate", 0) * 0.5
        + class_probabilities.get("High", 0) * 1.0
    )

    # Get predicted risk level
    prediction = model.predict(input_data)[0]

    risk_level = prediction.upper()

    return {
        "risk_level": risk_level,
        "risk_score": round(float(risk_score), 2)
    }
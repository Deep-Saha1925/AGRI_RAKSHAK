from weather.weather_service import get_weather_data
from prediction.ml_predictor import predict_risk
from irrigation.irrigation_advisor import recommend_irrigation


def predict_environmental_risk_ml(
    lat,
    lng,
    soil_moisture,
    rainfall_mm=10
):
    """
    Combine weather data, ML risk prediction,
    and irrigation recommendation.
    """

    # Get weather data
    weather = get_weather_data(
        lat,
        lng,
        rainfall_mm=rainfall_mm
    )

    # Predict risk using the trained ML model
    risk = predict_risk(
        rainfall_mm=weather["rainfall_mm"],
        soil_moisture_percent=soil_moisture
    )

    # Get irrigation recommendation
    irrigation = recommend_irrigation(
        soil_moisture_percent=soil_moisture,
        rainfall_mm=weather["rainfall_mm"]
    )

    # Final environmental prediction
    result = {
        "lat": lat,
        "lng": lng,
        "weather": weather,
        "soil_moisture_percent": soil_moisture,
        "risk_level": risk["risk_level"],
        "risk_score": risk["risk_score"],
        "irrigation": irrigation
    }

    return result


### Integrating ML Risk Prediction

# This step connects the trained Machine Learning model with the environmental prediction pipeline.

# The pipeline now:
# 1. Gets weather data.
# 2. Sends rainfall and soil moisture to the ML model.
# 3. Receives both `risk_level` and `risk_score`.
# 4. Calculates an irrigation recommendation.
# 5. Combines everything into one final prediction result.

# Important variables:
# - `weather` → weather conditions for the field.
# - `risk` → ML model's predicted risk level and derived risk score.
# - `irrigation` → irrigation recommendation based on rainfall and soil moisture.
# - `result` → final output that can later be sent to the backend API.
from weather.weather_service import get_weather_data
from prediction.risk_engine import calculate_risk
from irrigation.irrigation_advisor import recommend_irrigation


def predict_environmental_risk(lat, lng, soil_moisture):
    """
    Combine weather data, risk calculation,
    and irrigation recommendation.
    """

    # Get weather data
    weather = get_weather_data(lat, lng)

    # Calculate environmental risk
    risk = calculate_risk(
        rainfall_mm=weather["rainfall_mm"],
        soil_moisture_percent=soil_moisture
    )

    # Calculate irrigation recommendation
    irrigation = recommend_irrigation(
        soil_moisture_percent=soil_moisture,
        rainfall_mm=weather["rainfall_mm"]
    )

    result = {
        "lat": lat,
        "lng": lng,
        "weather": weather,
        "soil_moisture_percent": soil_moisture,
        "risk": risk,
        "irrigation": irrigation
    }

    return result
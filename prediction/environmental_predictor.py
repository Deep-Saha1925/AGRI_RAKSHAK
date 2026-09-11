# from weather.weather_service import get_weather_data
# from prediction.risk_engine import calculate_risk
# from irrigation.irrigation_advisor import recommend_irrigation


# def predict_environmental_risk(lat, lng, soil_moisture):
#     """
#     Combine weather data, risk calculation,
#     and irrigation recommendation.
#     """

#     # Get weather data
#     weather = get_weather_data(lat, lng)

#     # Calculate environmental risk
#     risk = calculate_risk(
#         rainfall_mm=weather["rainfall_mm"],
#         soil_moisture_percent=soil_moisture
#     )

#     # Calculate irrigation recommendation
#     irrigation = recommend_irrigation(
#         soil_moisture_percent=soil_moisture,
#         rainfall_mm=weather["rainfall_mm"]
#     )

#     result = {
#         "lat": lat,
#         "lng": lng,
#         "weather": weather,
#         "soil_moisture_percent": soil_moisture,
#         "risk": risk,
#         "irrigation": irrigation
#     }

#     return result



from datetime import datetime, timezone

from weather.weather_service import get_weather_data
from prediction.risk_engine import calculate_risk
from irrigation.irrigation_advisor import recommend_irrigation


def predict_environmental_risk(field_id, lat, lng, soil_moisture):
    """
    Combine weather data, environmental risk calculation,
    and irrigation recommendation.

    The risk_payload follows Person 3's POST /risk/ API contract.
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

    # Exact payload required by Person 3's POST /risk/ contract
    risk_payload = {
        "field_id": field_id,
        "risk_level": risk["risk_level"],
        "risk_score": risk["risk_score"],
        "irrigation": irrigation["irrigation"],
        "reason": irrigation["reason"],
        "computed_at": datetime.now(timezone.utc).isoformat()
    }

    # Detailed result retained for local prototype/demo use
    result = {
        "lat": lat,
        "lng": lng,
        "weather": weather,
        "soil_moisture_percent": soil_moisture,
        "risk": risk,
        "irrigation": irrigation,
        "risk_payload": risk_payload
    }

    return result
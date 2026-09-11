# This test connects two parts of Person 2's module. First, it gets weather data from weather_service.py. Then we provide the soil-moisture value and send both rainfall and soil moisture to risk_engine.py. The final result is the environmental risk level, normalized risk score, irrigation recommendation, and reason.
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from weather.weather_service import get_weather_data
from prediction.risk_engine import calculate_risk


# Example field location
lat = 26.7100
lng = 88.4285

# Get weather data
weather = get_weather_data(lat, lng)

# Example soil moisture
soil_moisture = 18


# Calculate environmental risk
result = calculate_risk(
    rainfall_mm=weather["rainfall_mm"],
    soil_moisture_percent=soil_moisture
)


print("\n--- CropShield Environmental Risk ---")
print("Latitude:", lat)
print("Longitude:", lng)
print("Rainfall:", weather["rainfall_mm"], "mm")
print("Temperature:", weather["temperature_c"], "°C")
print("Humidity:", weather["humidity_percent"], "%")
print("Wind Speed:", weather["wind_speed_kmph"], "km/h")
print("Soil Moisture:", soil_moisture, "%")

print("\nRisk Result:")
print(result)
# This test checks whether our complete ML pipeline behaves differently when environmental conditions change.

# We'll test:

# Normal conditions
# Low rainfall + low soil moisture
# High rainfall
# High soil moisture
# Higher rainfall + low moisture

from prediction.ml_environmental_predictor import predict_environmental_risk_ml
test_cases = [
    {
        "name": "Normal conditions",
        "soil_moisture": 28
    },
    {
        "name": "Low rainfall + low moisture",
        "soil_moisture": 18
    },
    {
        "name": "High rainfall",
        "soil_moisture": 28
    },
    {
        "name": "High soil moisture",
        "soil_moisture": 40
    },
    {
        "name": "High rainfall + low moisture",
        "soil_moisture": 18
    }
]


for case in test_cases:

    result = predict_environmental_risk_ml(
        lat=26.7100,
        lng=88.4285,
        soil_moisture=case["soil_moisture"]
    )

    print("\n------------------------------")
    print("Scenario:", case["name"])
    print("Rainfall:", result["weather"]["rainfall_mm"], "mm")
    print("Soil Moisture:", result["soil_moisture_percent"], "%")
    print("ML Risk:", result["risk_level"])
    print("Irrigation:", result["irrigation"]["irrigation"])
    print("Reason:", result["irrigation"]["reason"])
from irrigation_advisor import recommend_irrigation


test_cases = [
    {
        "name": "Low soil moisture",
        "soil_moisture": 18,
        "rainfall": 10
    },
    {
        "name": "High rainfall",
        "soil_moisture": 28,
        "rainfall": 25
    },
    {
        "name": "High soil moisture",
        "soil_moisture": 40,
        "rainfall": 17
    },
    {
        "name": "Normal conditions",
        "soil_moisture": 28,
        "rainfall": 17
    }
]


for case in test_cases:

    result = recommend_irrigation(
        soil_moisture_percent=case["soil_moisture"],
        rainfall_mm=case["rainfall"]
    )

    print("\nScenario:", case["name"])
    print("Soil Moisture:", case["soil_moisture"], "%")
    print("Rainfall:", case["rainfall"], "mm")
    print("Recommendation:", result["irrigation"])
    print("Reason:", result["reason"])
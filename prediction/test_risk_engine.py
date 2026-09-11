from risk_engine import calculate_risk


test_cases = [
    {
        "name": "Normal conditions",
        "rainfall": 17,
        "soil_moisture": 28
    },
    {
        "name": "Low rainfall + low moisture",
        "rainfall": 10,
        "soil_moisture": 18
    },
    {
        "name": "High rainfall",
        "rainfall": 25,
        "soil_moisture": 28
    },
    {
        "name": "High soil moisture",
        "rainfall": 17,
        "soil_moisture": 40
    }
]


for case in test_cases:
    result = calculate_risk(
        rainfall_mm=case["rainfall"],
        soil_moisture_percent=case["soil_moisture"]
    )

    print("\nScenario:", case["name"])
    print("Rainfall:", case["rainfall"], "mm")
    print("Soil Moisture:", case["soil_moisture"], "%")
    print("Result:", result)
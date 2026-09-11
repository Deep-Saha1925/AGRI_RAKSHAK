def recommend_irrigation(soil_moisture_percent, rainfall_mm):
    """
    Give a basic irrigation recommendation based on
    soil moisture and rainfall.

    This is a prototype rule-based version.
    It can be improved later using real agricultural data.
    """

    if rainfall_mm > 19:
        recommendation = "WAIT"
        reason = "Rainfall is high, so irrigation should be avoided for now."

    elif soil_moisture_percent < 20:
        recommendation = "IRRIGATE"
        reason = "Soil moisture is low, so irrigation is recommended."

    elif soil_moisture_percent > 35:
        recommendation = "WAIT"
        reason = "Soil moisture is already high, so irrigation is not needed."

    else:
        recommendation = "NORMAL"
        reason = "Soil moisture is within the normal range."

    return {
        "irrigation": recommendation,
        "reason": reason
    }
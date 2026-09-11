def calculate_risk(rainfall_mm, soil_moisture_percent):
    """
    Calculate an initial environmental risk score.

    This is a prototype rule-based version.
    It will later be replaced or enhanced with the ML model.
    """

    score = 0
    reasons = []

    # Rainfall risk
    if rainfall_mm < 15:
        score += 0.20
        reasons.append("Low rainfall")
    elif rainfall_mm > 19:
        score += 0.20
        reasons.append("High rainfall")

    # Soil moisture risk
    if soil_moisture_percent < 20:
        score += 0.30
        reasons.append("Low soil moisture")
    elif soil_moisture_percent > 35:
        score += 0.30
        reasons.append("High soil moisture")

    # Keep score between 0 and 1
    score = min(score, 1.0)

    # Convert score into risk level
    if score >= 0.40:
        risk_level = "HIGH"
    elif score >= 0.20:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    # Irrigation recommendation
    if soil_moisture_percent < 20 and rainfall_mm <= 19:
        irrigation = "IRRIGATE"
    elif rainfall_mm > 19:
        irrigation = "WAIT"
    else:
        irrigation = "NORMAL"

    reason = ", ".join(reasons) if reasons else "Environmental conditions are normal"

    return {
        "risk_level": risk_level,
        "risk_score": score,
        "irrigation": irrigation,
        "reason": reason
    }
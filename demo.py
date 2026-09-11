from prediction.ml_environmental_predictor import predict_environmental_risk_ml
from pprint import pprint


# Demo field ID.
# In the real backend, this will come from Person 3's field registration.
FIELD_ID = 12

print("=== Scenario 1: Dry Field ===")
pprint(
    predict_environmental_risk_ml(
        FIELD_ID,
        26.7100,
        88.4285,
        18,
        rainfall_mm=10
    )
)

print("\n=== Scenario 2: Good Rainfall ===")
pprint(
    predict_environmental_risk_ml(
        FIELD_ID,
        26.7100,
        88.4285,
        28,
        rainfall_mm=25
    )
)

print("\n=== Scenario 3: Normal Field ===")
pprint(
    predict_environmental_risk_ml(
        FIELD_ID,
        26.7100,
        88.4285,
        28,
        rainfall_mm=17
    )
)
# IT21433788 - Hemathunga GGSD
# Demo Integration - YOLO + Severity Module
# For Viva Demonstration - Fruit Diseases B,N,P

from severity_module import SeverityEstimator, TreatmentRecommender

def run_demo():
    severity_tool = SeverityEstimator()
    treatment_tool = TreatmentRecommender()

    test_cases = [
        {"code": "P", "infected": 235, "total": 1000},
        {"code": "B", "infected": 600, "total": 1000},
        {"code": "N", "infected": 0, "total": 1000},
    ]

    print("--- Green Chili Assessment System (IT21433788) ---")
    for case in test_cases:
        code = case["code"]
        perc = severity_tool.calculate_severity(case["infected"], case["total"])
        level = severity_tool.get_severity_level(perc)
        rec = treatment_tool.get_recommendation(code, level)
        
        print(f"\nDisease Code: {code} -> {rec['Disease_Name']}")
        print(f"Severity: {perc}% ({level})")
        print(f"Treatment: {rec['Chemical']} | {rec['Organic']}")

if __name__ == "__main__":
    run_demo()

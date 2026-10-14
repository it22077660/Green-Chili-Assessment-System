# IT21433788 - Hemathunga GGSD
# Individual Part - Severity Estimation & Treatment Recommendation
# For Fruit Disease Classification (B,N,P)

class SeverityEstimator:
    """
    Contribution 2 - Disease severity estimation
    Formula: Severity(%) = Infected / Total * 100
    """
    def calculate_severity(self, infected_pixels, total_pod_pixels):
        if total_pod_pixels == 0:
            return 0
        severity = (infected_pixels / total_pod_pixels) * 100
        return round(severity, 2)

    def get_severity_level(self, percentage):
        if percentage < 10:
            return "Mild"
        elif percentage < 40:
            return "Moderate"
        else:
            return "Severe"

class TreatmentRecommender:
    """
    Contribution 3 - Treatment Recommendation Module
    Based on Agricultural Guidance for Chili Fruit Diseases
    """
    def __init__(self):
        self.recommendations = {
            "P": {
                "Disease_Name": "Anthracnose",
                "Chemical": "Mancozeb or Carbendazim spray",
                "Organic": "Neem oil spray",
                "Cultural": "Remove infected pods, avoid overhead watering"
            },
            "B": {
                "Disease_Name": "Phytophthora rot",
                "Chemical": "Copper-based fungicide",
                "Organic": "Improve drainage",
                "Cultural": "Avoid waterlogging"
            },
            "N": {
                "Disease_Name": "Healthy",
                "Chemical": "No chemical needed",
                "Organic": "Continue organic practices",
                "Cultural": "Regular monitoring"
            }
        }

    def get_recommendation(self, disease_code, severity_level):
        base = self.recommendations.get(disease_code, {
            "Disease_Name": "Unknown",
            "Chemical": "General fungicide", 
            "Organic": "Neem extract", 
            "Cultural": "Field sanitation"
        })
        
        if severity_level == "Severe" and disease_code != "N":
            base["Note"] = "Urgent action required - Isolate plant"
        return base

if __name__ == "__main__":
    est = SeverityEstimator()
    rec = TreatmentRecommender()
    
    predicted_class = "P" 
    sev = est.calculate_severity(235, 1000)
    level = est.get_severity_level(sev)
    
    print(f"Predicted: {predicted_class}")
    print(f"Severity: {sev}% - {level}")
    print(rec.get_recommendation(predicted_class, level))

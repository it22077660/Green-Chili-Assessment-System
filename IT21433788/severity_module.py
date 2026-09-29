# IT21433788 - Hemathunga GGSD
# Individual Part - Severity Estimation & Treatment Recommendation

class SeverityEstimator:
    """
    Contribution 2 - Disease severity estimation
    Formula from Report Page 9: Severity(%) = Infected / Total * 100
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
    Based on Sri Lankan Agricultural Guidance
    """
    def _init_(self):
        self.recommendations = {
            "Anthracnose": {
                "Chemical": "Mancozeb or Carbendazim spray",
                "Organic": "Neem oil spray",
                "Cultural": "Remove infected pods, avoid overhead watering"
            },
            "Phytophthora rot": {
                "Chemical": "Copper-based fungicide",
                "Organic": "Improve drainage",
                "Cultural": "Avoid waterlogging"
            },
            "Healthy": {
                "Chemical": "No chemical needed",
                "Organic": "Continue organic practices",
                "Cultural": "Regular monitoring"
            }
        }

    def get_recommendation(self, disease, severity_level):
        base = self.recommendations.get(disease, {
            "Chemical": "General fungicide", 
            "Organic": "Neem extract", 
            "Cultural": "Field sanitation"
        })
        
        if severity_level == "Severe":
            base["Note"] = "Urgent action required - Isolate plant"
        return base

# Test for Viva Demo
if _name_ == "_main_":
    est = SeverityEstimator()
    rec = TreatmentRecommender()
    
    # Example from your report: 235 / 1000 = 23.5%
    sev = est.calculate_severity(235, 1000)
    level = est.get_severity_level(sev)
    print(f"Severity: {sev}% - {level}")
    print(rec.get_recommendation("Anthracnose", level))

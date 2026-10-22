# IT21433788 - Severity Estimation Module
# Green Chili Pod Disease Assessment

class SeverityEstimator:

    def calculate_severity(self, image_path, predicted_class):
        # healthy nam severity eka godak adui
        if predicted_class == "Healthy":
            severity_value = 1.5
        else:
            # disease thiyenawa nam severity eka wedi
            severity_value = 65.0
            
        return severity_value

    def get_severity_level(self, severity_percent, predicted_class):
        # level eka decide karanne meken
        
        if predicted_class == "Healthy":
            return "Low"
            
        if severity_percent < 10:
            return "Low"
        elif severity_percent < 40:
            return "Medium"
        else:
            return "High"

    def estimate_severity_from_mask(self, mask_area, total_area):
        # yolo mask eken severity hadanawa nam
        if total_area == 0:
            return 0.0
            
        sev = (mask_area / total_area) * 100
        
        if sev < 2:
            return 1.5
            
        return round(sev, 2)
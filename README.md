🌶️ AI-Driven Green Chili Crop Assessment and Decision Support System
Research Group: J26-IT-466
Programme: B.Sc. (Hons) in Information Technology, Sri Lanka Institute of Information Technology (SLIIT)
Research Stage: PP1 prototype and ongoing development
Project status: This repository contains work in progress. Component descriptions below define the group research scope; implementation and validation status vary by component. Confirm each member's latest results before reporting them as completed.

1. Project Overview
This research explores an AI-assisted system for assessing green chili crop maturity, fruit condition, diseases, disease severity, and climate-related risk and yield. The goal is to provide farmers with more useful information for crop monitoring and management decisions, rather than relying on a single image classification output.

The proposed solution comprises four related research components, developed by different team members. The components may use different input modalities, models, and evaluation procedures.
2. Problem Statement
Chili growers may need to assess maturity, identify visible health problems, estimate disease severity, and account for environmental conditions when making crop-management decisions. A prediction of a visual class alone does not establish harvest suitability, disease severity, or future yield. This project investigates separate AI-based assessments and decision-support workflows addressing those needs.
3. Research Aim and Objectives
Aim: Develop and evaluate an AI-assisted green chili crop assessment and decision-support system.

Objectives:
1. Classify chili maturity and visible fruit-condition categories from images.
2. Provide preliminary harvest-target-aware guidance supported by farmer inspection.
3. Investigate image-based chili health and disease classification.
4. Investigate disease severity and crop-health assessment.
5. Investigate climate-aware risk and yield prediction using appropriate environmental and crop data.
6. Evaluate each component using suitable datasets and metrics, and explore integration into a usable interface.
4. Research Components
Component	Research focus	Main inputs	Intended outputs	Researcher
1	Image-Based Chili Maturity, Fruit Condition and Harvest Decision Support	Chili/flower images; chosen green/red harvest target; farmer checklist responses	Five-class prediction, confidence, preliminary harvest guidance	Kushani Rathnayake
2	Image-Based Chili Health and Disease Classification	Chili leaf and/or fruit images	Health/disease category and confidence	Pramudi
3	Disease Severity and Crop Health Assessment	Relevant crop images	Disease severity and crop-health indicators	Dushan
4	Climate-Aware Risk and Yield Prediction	Environmental and crop data	Risk and yield estimates	Nimantha


Component 1 does not diagnose named diseases or measure disease severity. Those are distinct research areas covered by Components 2 and 3.

5. Component 1: Maturity, Fruit Condition and Harvest Decision Support
5.1 Scope
Component 1 uses image classification to recognize five visual categories:
- Flower
- Green Chili
- Red Chili
- Rotten Chili
- Dry Chili
The classification output is then used in a rule-based, harvest-target-aware decision-support workflow. This workflow is not a separately trained harvest-readiness prediction model.
5.2 Dataset
The reported dataset contains 1,714 original images:
Class	Original images
Flower	397
Green Chili	328
Red Chili	200
Rotten Chili	379
Dry Chili	410
Total	1,714


Image augmentation was used during model development, yielding approximately 11,000 augmented images as reported by the component researcher. Augmented images should not be treated as independent field observations. Dataset provenance, permission, splitting strategy, and preprocessing settings should be documented in the associated research report/notebooks.
5.3 Image Classification Method
- Image preprocessing and training-time augmentation
- Transfer learning with EfficientNetB0
- Five-class image classification
- Evaluation on a held-out test set
Reported held-out test accuracy: 99.23% (259/261 correct) for five-class image classification. This is not a measure of real-world harvest-readiness accuracy. Model performance under new farm conditions requires separate validation.

The selected model artifact in the Component 1 branch is named:
final_efficientnetb0_chili_model.keras
5.4 Harvest Readiness Decision Support
1. The farmer uploads an image.
2. The farmer selects a green or red harvest target.
3. The classification model predicts one of the five visual classes and returns a confidence score.
4. The system compares the predicted class with the chosen target.
5. For matching Green Chili + green target or Red Chili + red target, the farmer is prompted to inspect physical criteria such as size, firmness, expected color, and visible damage.
6. The interface presents preliminary guidance, not a certified harvest decision.
Illustrative behavior:
Predicted class / target	Preliminary interpretation
Green Chili / green target	Potentially ready, subject to physical inspection
Red Chili / red target	Potentially ready, subject to physical inspection
Red Chili / green target	Past the selected green-color harvest target
Flower / either target	Not ready for fruit harvest
Rotten or Dry / either target	Requires separate condition/quality inspection


The precise UI wording may evolve with implementation. The model does not infer exact fruit age, days to harvest, measured size, or physical firmness from the image.
5.5 Implementation
The Component 1 prototype uses:
- Python / TensorFlow / Keras for image classification
- EfficientNetB0 as the selected image classifier
- FastAPI for prediction API integration
- React for the farmer-facing web interface
- Rule-based logic and farmer input for preliminary harvest guidance
A reported API endpoint is POST /predict, which accepts an image and a harvest-target selection. Confirm the current request fields and response schema from the actual backend source before integrating a new client.
5.6 Limitations and Future Evaluation
- No independently trained harvest-readiness model or expert-validated readiness accuracy is reported.
- No exact fruit age or harvest-date prediction is supported.
- Physical checks require farmer input and are not inferred by the image model.
- Held-out classification accuracy may not generalize to unseen farms, lighting, cameras, or varieties.
- Planned next steps include expert-labeled readiness data, field testing, baseline comparisons, and usability evaluation.
6. Components 2–4: Planned/Parallel Research Scope
Component 2 — Chili Health and Disease Classification
Investigates visual recognition of healthy and diseased chili plant material and, where supported by labels, disease categories. Model choice, dataset, class definitions, and validated results should be documented by the responsible researcher.
Component 3 — Disease Severity and Crop Health Assessment
Investigates quantitative or categorical severity assessment from crop imagery, potentially including affected-area estimation. Ground-truth annotation methods and evaluation metrics must be documented separately from Component 2 disease labels.
Component 4 — Climate-Aware Risk and Yield Prediction
Investigates relationships between environmental/crop measurements and disease risk or yield. Data availability, prediction horizon, model evaluation, and uncertainty should be documented by the responsible researcher.
Important: This README does not claim completed models, measured accuracies, or production deployment for Components 2–4 without verified evidence.

7. High-Level System Workflow
                        GREEN CHILI RESEARCH SYSTEM
                                     |
            +------------------------+-------------------------+
            |                        |                         |
       Crop Images             Crop Images               Climate/Crop Data
            |                        |                         |
    +-------+-------+        +-------+-------+                 |
    |               |        |               |                 |
 Component 1     Component 2 Component 3  (separate)      Component 4
 Maturity &      Disease     Severity &                   Risk & Yield
 Fruit Condition Classification Crop Health               Prediction
    |
 Five-Class Classifier
    |
 Harvest Target + Farmer Checklist
    |
 Preliminary Harvest Guidance
This is a conceptual architecture; it does not imply that all four components are already integrated or deployed.
8. Repository Structure
The following files/folders were visible in the IT22077660 branch at the time of PP1 documentation:
Green-Chili-Assessment-System/
├── backend/
├── frontend/
├── .gitignore
├── 01_Dataset_Inspection.ipynb
├── README.md
└── final_efficientnetb0_chili_model.keras
Other branches, including main, may have a different structure. Update this tree after confirming the current main branch contents.
9. Local Development (Component 1)
Prerequisites: Python environment with the backend dependencies, Node.js/npm for the React frontend, and the model file accessible to the backend.

The exact commands depend on the current repository files. A typical workflow is:
# In one terminal, from the project root:
python -m uvicorn backend.main:app --reload --port 8000

# In a second terminal:
cd frontend
npm install
npm run dev
Before running, install the Python dependencies specified by the actual backend environment/requirements file, and verify that the model path and API base URL are configured correctly. Do not assume a particular requirements filename or frontend port unless it exists in the repository.
10. Evaluation and Reporting
For transparent PP1/PP2 reporting, each component should document:
- Dataset source, labels, size, and permissions
- Preprocessing and augmentation approach
- Train/validation/test splitting method and leakage controls
- Model baselines and selection criteria
- Evaluation metrics appropriate to the task
- Limitations, failure cases, and proposed validation
- Screenshots or demo evidence, where available
For Component 1, distinguish classification accuracy from harvest decision quality in all presentations and reports.
11. Team and Contributions
Researcher	Responsibility
Kushani Rathnayake	Component 1 — Maturity, fruit condition, harvest decision support
Pramudi	Component 2 — Health and disease classification
Dushan	Component 3 — Disease severity and crop health
Nimantha	Component 4 — Climate-aware risk and yield prediction


Each contributor should maintain their component's code, documentation, and experiment records in the appropriate branch or agreed project structure.
12. Repository and Documentation
- Repository: https://github.com/it22077660/Green-Chili-Assessment-System
- Component 1 branch: https://github.com/it22077660/Green-Chili-Assessment-System/tree/IT22077660
- Main branch README (after commit): https://github.com/it22077660/Green-Chili-Assessment-System/blob/main/README.md
PP1 Checklist Note
This README is intended to support the PP1 Git Repository / README.md checklist. The team should confirm that the committed README accurately reflects the latest main branch and any institution-specific documentation requirements.

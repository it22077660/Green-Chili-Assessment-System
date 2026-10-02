# 🌶️ Green Chili Intelligent Assessment System

### AI-Powered Green Chili Crop Assessment and Intelligent Decision Support

The **Green Chili Intelligent Assessment System** is an AI-powered research platform developed to support intelligent monitoring and assessment of green chili crops.

The complete research system consists of four analytical components covering **growth and maturity assessment, disease classification, disease severity assessment, and climate-aware risk and yield prediction**.

---

## 🌱 Component 1 — Growth, Maturity & Fruit Condition Assessment

This repository contains the implementation of **Component 1**, which focuses on image-based assessment of green chili growth, maturity, and visible fruit condition.

A user can upload a chili image through the web interface, and the trained deep-learning model analyzes the image and predicts one of five categories together with a confidence score.

### 🎯 Output Classes

| Class | Description |
|---|---|
| 🌼 **Flower** | Flowering stage of the chili plant |
| 🟢 **Green Chili** | Green maturity stage |
| 🔴 **Red Chili** | Red maturity stage |
| 🟠 **Rotten Chili** | Visible fruit deterioration / rotten condition |
| 🟤 **Dry Chili** | Dry fruit condition |

---

## 🏗️ System Architecture

The component follows an end-to-end image classification pipeline connecting the React-based user interface with the FastAPI backend and the trained EfficientNetB0 deep-learning model.

![Component 1 System Architecture](docs/component1-system-architecture.png)

### 🔄 Assessment Flow

**Chili Image Upload → FastAPI Backend → Image Preprocessing → EfficientNetB0 Model → Five-Class Prediction → Confidence Score → Assessment Result**
<img width="1774" height="887" alt="component1-system-architecture png" src="https://github.com/user-attachments/assets/9558833e-b2bb-4eb2-b03c-603c83f437b8" />
![Uploading component1-system-architecture.png.png…]()

---

## 🧠 Deep Learning Model

The classification model was developed using **EfficientNetB0 with transfer learning**.

The input chili image is resized and preprocessed before being passed to the trained model. The model then produces a five-class prediction using a Softmax output layer.

**Model:** EfficientNetB0  
**Input Size:** 224 × 224 × 3  
**Classification Type:** Multi-class image classification  
**Number of Classes:** 5  
**Output:** Predicted class and confidence score

---

## 📊 Dataset

The original image dataset contained **1,714 chili images** across five categories.

| Category | Original Images |
|---|---:|
| Flower | 397 |
| Green Chili | 328 |
| Red Chili | 200 |
| Rotten Chili | 379 |
| Dry Chili | 410 |
| **Total** | **1,714** |

Image augmentation was applied during dataset preparation to improve the robustness of the deep-learning model.

---

## 💻 Technology Stack

### Frontend
- React.js
- Vite
- React Router
- CSS

### Backend
- Python
- FastAPI
- Uvicorn

### Machine Learning
- TensorFlow
- Keras
- EfficientNetB0
- Transfer Learning
- Image Preprocessing & Augmentation

---

## 📁 Project Structure

```text
Green-Chili-Assessment-System/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Assessment.jsx
│       │   ├── History.jsx
│       │   └── ModelPerformance.jsx
│       ├── App.jsx
│       └── App.css
│
├── docs/
│   └── component1-system-architecture.png
│
├── 01_Dataset_Inspection.ipynb
├── final_efficientnetb0_chili_model.keras
└── README.md
```

---

## 🚀 Main Features

- Upload chili images through a web interface
- AI-based five-class image classification
- Growth and maturity stage identification
- Visible fruit condition assessment
- Prediction confidence display
- Assessment history
- Model performance visualization
- React frontend integrated with a FastAPI backend

---

## 🔬 Research Scope

Component 1 focuses specifically on:

> **“What stage is the chili at, and is its visible condition normal or deteriorated?”**

The component does **not** diagnose specific named diseases. Disease classification and disease severity assessment are handled separately by other components of the integrated research system.

---

## 🔗 Integrated Research System

The complete Green Chili Intelligent Assessment System consists of:

**Component 01** — Growth, Maturity & Fruit Condition Assessment  
**Component 02** — Chili Health & Disease Classification  
**Component 03** — Disease Severity & Crop Health Assessment  
**Component 04** — Climate-Aware Risk & Yield Prediction

Together, these analytical components contribute to a broader AI-assisted green chili monitoring and decision-support platform.

---

## 👩‍💻 Component 1

**Growth, Maturity & Fruit Condition Assessment**  
B.Sc. (Hons) Information Technology Research Project  
Sri Lanka Institute of Information Technology (SLIIT)

---

<p align="center">
  <b>🌱 From Image to Insight — Intelligent Green Chili Assessment 🌶️</b>
</p>

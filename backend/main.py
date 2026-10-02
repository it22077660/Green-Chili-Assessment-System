from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import tensorflow as tf
import numpy as np
from PIL import Image

import io
import os


# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title="Green Chili Growth & Maturity Assessment API",
    description="Image-based chili maturity and fruit condition classification",
    version="1.0.0"
)


# --------------------------------------------------
# Allow React Frontend
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Model Configuration
# --------------------------------------------------

MODEL_PATH = r"D:\Chili_Project\final_efficientnetb0_chili_model.keras"

CLASS_NAMES = [
    "Dry chili",
    "Flower",
    "Green Chili",
    "Red Chili",
    "Rotten Chili"
]


# --------------------------------------------------
# Load Model
# --------------------------------------------------

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model file not found: {MODEL_PATH}"
    )

model = tf.keras.models.load_model(MODEL_PATH)

print("EfficientNetB0 chili model loaded successfully!")


# --------------------------------------------------
# Home Route
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Green Chili Assessment API is running",
        "model": "EfficientNetB0",
        "classes": CLASS_NAMES
    }


# --------------------------------------------------
# Prediction Route
# --------------------------------------------------

@app.post("/predict")
async def predict_chili(file: UploadFile = File(...)):

    # Check uploaded file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    try:
        # Read uploaded image
        contents = await file.read()

        image = Image.open(
            io.BytesIO(contents)
        ).convert("RGB")

        # Resize exactly as used during training
        image = image.resize((224, 224))

        # Convert image to array
        image_array = np.array(
            image,
            dtype=np.float32
        )

        # Add batch dimension
        image_batch = np.expand_dims(
            image_array,
            axis=0
        )

        # Model prediction
        predictions = model.predict(
            image_batch,
            verbose=0
        )[0]

        predicted_index = int(
            np.argmax(predictions)
        )

        predicted_class = CLASS_NAMES[
            predicted_index
        ]

        confidence = float(
            predictions[predicted_index] * 100
        )

        # All class probabilities
        probabilities = {
            CLASS_NAMES[i]: round(
                float(predictions[i] * 100),
                2
            )
            for i in range(len(CLASS_NAMES))
        }

        # Human-readable interpretation
        interpretations = {
            "Flower": {
                "category": "Growth Stage",
                "assessment": "Flowering Stage"
            },

            "Green Chili": {
                "category": "Maturity Stage",
                "assessment": "Immature / Green Fruit Stage"
            },

            "Red Chili": {
                "category": "Maturity Stage",
                "assessment": "Mature / Ripe Fruit Stage"
            },

            "Rotten Chili": {
                "category": "Fruit Condition",
                "assessment": "Rotten / Deteriorated Fruit"
            },

            "Dry chili": {
                "category": "Fruit Condition",
                "assessment": "Dry Fruit Condition"
            }
        }

        result = interpretations[
            predicted_class
        ]

        return {
            "predicted_class": predicted_class,
            "confidence": round(confidence, 2),
            "category": result["category"],
            "assessment": result["assessment"],
            "probabilities": probabilities
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}"
        )

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import tensorflow as tf
import numpy as np
from PIL import Image, UnidentifiedImageError

import io
import os


# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title="Green Chili Maturity & Harvest Readiness API",
    description=(
        "Image-based chili maturity classification "
        "and preliminary harvest decision support"
    ),
    version="2.0.0"
)


# --------------------------------------------------
# Allow React Frontend
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Model Configuration
# --------------------------------------------------

MODEL_PATH = (
    r"D:\Chili_Project\final_efficientnetb0_chili_model.keras"
)

CLASS_NAMES = [
    "Dry chili",
    "Flower",
    "Green Chili",
    "Red Chili",
    "Rotten Chili"
]

CONFIDENCE_THRESHOLD = 70.0

VALID_HARVEST_TARGETS = ["green", "red"]


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
# Harvest Readiness Assessment
# --------------------------------------------------

def assess_harvest_readiness(
    predicted_class,
    confidence,
    harvest_target
):
    """
    Preliminary rule-based harvest decision support.

    IMPORTANT:
    - This does not predict plant or fruit age.
    - This does not predict an exact harvest date.
    - This does not diagnose diseases.
    - Harvest suitability requires further validation.
    """

    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "readiness": "Needs Inspection",
            "harvest_ready": None,
            "recommendation": (
                "The model prediction has low confidence. "
                "Please inspect the fruit manually or upload "
                "a clearer image."
            )
        }

    if predicted_class == "Flower":
        return {
            "readiness": "Not Ready",
            "harvest_ready": False,
            "recommendation": (
                "The image indicates the flowering stage. "
                "Fruit development is required before "
                "harvest readiness can be assessed."
            )
        }

    if predicted_class == "Green Chili":

        if harvest_target == "green":
            return {
                "readiness": "Potentially Ready",
                "harvest_ready": None,
                "recommendation": (
                    "The fruit matches the green harvest "
                    "color target. Check fruit size, firmness "
                    "and market requirements before harvesting."
                )
            }

        return {
            "readiness": "Not Ready for Red Harvest",
            "harvest_ready": False,
            "recommendation": (
                "The fruit is currently green. "
                "Continue monitoring its maturity "
                "if red chili harvesting is intended."
            )
        }

    if predicted_class == "Red Chili":

        if harvest_target == "red":
            return {
                "readiness": "Potentially Ready",
                "harvest_ready": None,
                "recommendation": (
                    "The fruit matches the red harvest "
                    "color target. Check its physical condition "
                    "and market requirements before harvesting."
                )
            }

        return {
            "readiness": "Past Green Harvest Target",
            "harvest_ready": False,
            "recommendation": (
                "The fruit has reached the red color stage "
                "and no longer matches the selected "
                "green harvest target."
            )
        }

    if predicted_class == "Rotten Chili":
        return {
            "readiness": "Needs Quality Inspection",
            "harvest_ready": None,
            "recommendation": (
                "The image shows visible fruit deterioration. "
                "Inspect the fruit before harvesting or handling. "
                "This result is not a disease diagnosis."
            )
        }

    if predicted_class == "Dry chili":
        return {
            "readiness": "Needs Quality Inspection",
            "harvest_ready": None,
            "recommendation": (
                "The image indicates a dry fruit condition. "
                "Inspect the fruit and confirm its intended "
                "harvest or processing purpose."
            )
        }

    return {
        "readiness": "Unknown",
        "harvest_ready": None,
        "recommendation": (
            "Manual inspection is recommended."
        )
    }


# --------------------------------------------------
# Human-Readable Interpretations
# --------------------------------------------------

INTERPRETATIONS = {
    "Flower": {
        "category": "Growth Stage",
        "assessment": "Flowering Stage"
    },

    "Green Chili": {
        "category": "Maturity Stage",
        "assessment": "Green Fruit Stage"
    },

    "Red Chili": {
        "category": "Maturity Stage",
        "assessment": "Red / Ripe Fruit Stage"
    },

    "Rotten Chili": {
        "category": "Fruit Condition",
        "assessment": "Visible Fruit Deterioration"
    },

    "Dry chili": {
        "category": "Fruit Condition",
        "assessment": "Dry Fruit Condition"
    }
}


# --------------------------------------------------
# Home Route
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Green Chili Assessment API is running",
        "model": "EfficientNetB0",
        "version": "2.0.0",
        "classes": CLASS_NAMES,
        "harvest_targets": VALID_HARVEST_TARGETS
    }


# --------------------------------------------------
# Prediction Route
# --------------------------------------------------

@app.post("/predict")
async def predict_chili(
    file: UploadFile = File(...),
    harvest_target: str = Form("green")
):

    # Validate harvest target
    harvest_target = harvest_target.strip().lower()

    if harvest_target not in VALID_HARVEST_TARGETS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid harvest target. "
                "Please select 'green' or 'red'."
            )
        )

    # Validate uploaded file type
    if (
        not file.content_type
        or not file.content_type.startswith("image/")
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    try:
        # Read uploaded image
        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="The uploaded image is empty."
            )

        # Open image
        image = Image.open(
            io.BytesIO(contents)
        ).convert("RGB")

        # Resize as used during model development
        image = image.resize((224, 224))

        # Convert to float32 array
        # Existing EfficientNetB0 model expects
        # the same preprocessing used during training.
        image_array = np.array(
            image,
            dtype=np.float32
        )

        # Add batch dimension
        image_batch = np.expand_dims(
            image_array,
            axis=0
        )

        # Predict
        predictions = model.predict(
            image_batch,
            verbose=0
        )[0]

        # Predicted class index
        predicted_index = int(
            np.argmax(predictions)
        )

        predicted_class = CLASS_NAMES[
            predicted_index
        ]

        # Confidence percentage
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

        # Interpretation
        result = INTERPRETATIONS[
            predicted_class
        ]

        # New harvest assessment
        harvest_result = assess_harvest_readiness(
            predicted_class=predicted_class,
            confidence=confidence,
            harvest_target=harvest_target
        )

        # Final API response
        return {
            "predicted_class": predicted_class,
            "confidence": round(confidence, 2),
            "category": result["category"],
            "assessment": result["assessment"],
            "probabilities": probabilities,

            # New fields
            "harvest_target": harvest_target,
            "harvest_assessment": harvest_result,

            "disclaimer": (
                "This is preliminary image-based "
                "decision support. Harvest readiness "
                "must be confirmed using physical "
                "inspection and crop-specific guidance."
            )
        }

    except HTTPException:
        raise

    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a readable image."
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}"
        )

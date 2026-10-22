# Model setup

Place the supplied Keras model at `~/Downloads/ResNet50_best.keras`. The API
loads that file when it starts. To use a different location, set `MODEL_PATH`
to the absolute `.keras` path before starting the API.

The model artifact is intentionally kept out of Git because it is large and
contains trained weights. Keep the original artifact available locally before
running inference. The API expects an input shape of `(None, 224, 224, 3)` and
six output logits matching `backend/labels.json`.

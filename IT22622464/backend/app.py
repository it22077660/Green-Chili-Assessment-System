"""Local inference API. The model already contains ResNet preprocessing."""
import io
import json
import os
import threading
import time
import warnings
from contextlib import asynccontextmanager
from pathlib import Path

os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', '2')
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageOps, UnidentifiedImageError
from starlette.concurrency import run_in_threadpool

ROOT = Path(__file__).resolve().parent
MODEL_PATH = Path(os.environ.get('MODEL_PATH', str(Path.home() / 'Downloads/ResNet50_best.keras')))
MAX_BYTES = 10 * 1024 * 1024
Image.MAX_IMAGE_PIXELS = 20_000_000
lock = threading.Lock()

@asynccontextmanager
async def lifespan(app):
    app.state.model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    app.state.labels = json.loads((ROOT / 'labels.json').read_text())
    if app.state.model.input_shape != (None, 224, 224, 3):
        raise ValueError('Expected 224 × 224 RGB model input')
    if len(app.state.labels) != app.state.model.output_shape[-1]:
        raise ValueError('Label count must match model outputs')
    yield

app = FastAPI(title='Leafwise inference', lifespan=lifespan)

@app.get('/api/health')
def health():
    return {'ready': True, 'model': 'ResNet50', 'classes': len(app.state.labels),
            'labelsConfigured': app.state.labels != [f'Class {i+1}' for i in range(6)]}

def infer(data):
    started = time.perf_counter()
    try:
        with warnings.catch_warnings():
            warnings.simplefilter('error', Image.DecompressionBombWarning)
            with Image.open(io.BytesIO(data)) as image:
                if image.format not in ('JPEG', 'PNG', 'WEBP'):
                    raise HTTPException(415, 'Please use a JPG, PNG or WebP image.')
                image = ImageOps.exif_transpose(image).convert('RGB')
                # Raw RGB 0–255: RGB→BGR and mean subtraction are inside this model.
                batch = np.asarray(image.resize((224, 224), Image.Resampling.BILINEAR), dtype=np.float32)[None]
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise HTTPException(400, 'This image is invalid or too large to decode safely.')
    with lock:
        logits = app.state.model(batch, training=False).numpy()[0]
    if not np.isfinite(logits).all():
        raise HTTPException(500, 'The model returned invalid scores.')
    scores = tf.nn.softmax(logits).numpy()
    predictions = sorted([{'index': i, 'label': label, 'score': float(scores[i])}
                          for i, label in enumerate(app.state.labels)], key=lambda x: x['score'], reverse=True)
    return {'predictions': predictions, 'elapsedMs': round((time.perf_counter()-started)*1000),
            'labelsConfigured': health()['labelsConfigured']}

@app.post('/api/predict')
async def predict(request: Request):
    # Read a raw image body incrementally so oversized uploads are rejected early.
    data = bytearray()
    async for chunk in request.stream():
        data.extend(chunk)
        if len(data) > MAX_BYTES:
            raise HTTPException(413, 'Choose an image smaller than 10 MB.')
    if not data:
        raise HTTPException(400, 'Choose an image first.')
    return await run_in_threadpool(infer, bytes(data))

# Serve the built UI from the API process for local setups without Node/Vite.
app.mount('/', StaticFiles(directory=ROOT.parent / 'dist', html=True), name='frontend')

# Leafwise — chili leaf analysis

React + Vite interface backed by a local FastAPI / TensorFlow API. Upload, drag and drop, image preview, six ranked predictions, model availability, and PDF report export. Images are processed in memory, not saved.

## Run

On this machine, the compatible runtime is installed in `.runtime/venv`. Start the API with `./start-api.sh` and the frontend with `npm run dev`. For a fresh installation, follow the setup below.

Use Node.js 20.19+ and Python 3.11 or 3.12.

```sh
npm install
python3.11 -m venv .venv
.venv/bin/python -m pip install -r backend/requirements.txt
```

Start the API in one terminal:

```sh
.venv/bin/python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

Start React in another terminal:

```sh
npm run dev
```

Open http://localhost:5173. The Vite development server proxies `/api` to port 8000.

If Node.js is unavailable, build the frontend once with `npm run build`, then run
`./start-local.sh`. It serves the built frontend and model API together at
http://localhost:5173.

The model defaults to `~/Downloads/ResNet50_best.keras`. To change it:

```sh
MODEL_PATH="/absolute/path/ResNet50_best.keras" .venv/bin/python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
```

## Model integration

The supplied Keras 3.13.2 model takes `(None, 224, 224, 3)` RGB images and returns six linear logits. It contains channel reversal and ImageNet mean subtraction, so the API supplies raw 0–255 pixels without a second normalization. EXIF orientation is applied, followed by RGB conversion and bilinear resize. Confirm resize behavior against the original training pipeline if exact evaluation parity is needed. Softmax converts logits to class scores; these scores are not calibrated diagnostic confidence.

`backend/labels.json` uses the supplied training order: Bacterial Spot, Cercospora Leaf Spot, Curl Virus, Healthy Leaf, Nutrition Deficiency, White spot.

The model cannot establish whether an input actually depicts a chili leaf. Use clear single-leaf images. Synthetic test images verify inference plumbing, not model accuracy.

## Validation and deployment

```sh
npm run build
.venv/bin/python -m pip install -r backend/requirements-dev.txt
.venv/bin/python -m unittest backend.test_api
```

On this machine, use `.runtime/venv/bin/python -m unittest backend.test_api` to run the tests. `backend/requirements-lock.txt` records the installed environment.

The tests load the actual model and check inference, labels, invalid images and upload limits. They require the model at `MODEL_PATH` or the default path.

`npm run build` produces `dist/`. Production hosting needs a Python service with the model and an HTTP reverse proxy forwarding `/api` to it. Vite's development proxy does not apply to the production bundle. This project is configured for local use; it has not been deployed. The model weights stay outside source control.

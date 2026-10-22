# Local inference API

The API binds to `127.0.0.1:8000` when run through `./start-api.sh` (or
`PORT` if set). The Vite development server forwards `/api` requests to it.

## Health

`GET /api/health` reports whether startup loaded the model and returns the
model name, class count, and whether the configured labels are in use.

## Prediction

`POST /api/predict` accepts a raw JPG, PNG, or WebP image body up to 10 MiB.
It returns the ranked class predictions, their scores, and inference time.
Images are decoded and processed in memory; the API does not save uploads.

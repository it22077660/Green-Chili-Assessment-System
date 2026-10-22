# Local development

The interface is a React/Vite application and the inference service is a local
FastAPI application. Use Node.js 20.19 or newer and Python 3.11 or 3.12.

Install the frontend dependencies with `npm install`. Create a Python
environment and install `backend/requirements.txt` before starting the API.

Run `./start-api.sh` in one terminal and `npm run dev` in another. Open
http://localhost:5173; Vite forwards `/api` requests to the API on port 8000.

If Node is unavailable and a frontend build already exists in `dist/`, run
`./start-local.sh` to serve the interface and API together on port 5173.

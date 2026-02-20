# PropTrack Frontend (React + Vite)

## Run (development)

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Backend default: `http://<frontend-host>:8000` (see `src/config.js`).
Override:

```bash
VITE_API_BASE=http://127.0.0.1:8000 npm run dev
```

## Build

```bash
npm run build
npm run preview
```

# Capstone: Property Rental Management Platform (PropTrack)

Week 1 scope implemented:
- **Frontend**: React + Zustand + React Router
- **Backend**: Django + DRF + SimpleJWT
- Auth: register/login/me + role-based routing + placeholder dashboards

## Repo layout (monorepo)
- `frontend/` (Vite React TS)
- `backend/` (Django project)

---

## Run (development)

### 1) Backend

```bash
cd backend
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
```

API endpoints:
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/auth/me/` (Bearer access token)

**Role policy (Week 1 decision):** new users default to `TENANT`.

Create an admin user (optional):
```bash
cd backend
python3 manage.py createsuperuser
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Frontend expects backend at `http://localhost:8000`.
Override with:
```bash
VITE_API_BASE=http://127.0.0.1:8000 npm run dev
```

---

## Week 1 Acceptance Criteria
- User can **register** and receives JWT tokens
- User can **login** and is redirected by role:
  - LANDLORD → `/landlord`
  - TENANT → `/tenant`
  - ADMIN → `/admin`
- Protected routes block access without login
- Homepage uses the provided UI/UX HTML (ported into React with Tailwind CDN)

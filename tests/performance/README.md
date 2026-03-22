# Task Manager API – Performance Tests (k6)

k6 performance tests for the Task Manager NestJS backend. All tests use minimal load (1–4 VUs, short duration) suited for CI/CD validation.

📖 Related: [Backend README](../../backend/README.md) | [Tests README](../README.md) | [Root README](../../README.md)

---

## Test Scenarios

| Test | Description | VUs | Duration |
|------|-------------|-----|----------|
| **smoke** | Health + login + CRUD | 1 | 3 iterations |
| **baseline** | Steady load | 2 | 1 min |
| **load** | Ramp 0→2 VUs | 2 | ~2 min |
| **stress** | Ramp 2→4 VUs | 4 | ~2 min |
| **spike** | Spike 2→4→2 VUs | 4 | ~1 min |
| **breakpoint** | Ramp 2→4 VUs | 4 | ~1.5 min |
| **soak** | 2 req/s, 1 min | 2–4 | 1 min |

---

## Prerequisites

- **k6** standalone binary (not npm)
  - macOS: `brew install k6`
  - Linux/Windows: [k6 installation docs](https://k6.io/docs/get-started/installation/)
- **Backend running** with seed data — see [Backend README](../../backend/README.md)

---

## Authentication

The backend requires a valid JWT for all endpoints except `POST /auth/login` and `GET /`. Each test calls `setup()` once to login and obtain a token, then passes it to all protected endpoint functions:

```js
export function setup() {
  return { token: login() };   // login() from lib/auth.js
}

export default function (data) {
  getUsers(data.token);        // Authorization: Bearer <token>
  getProjects(data.token);
  getTasks(data.token);
}
```

---

## Configuration

### Required

- `BASE_URL` — backend URL, no trailing slash (e.g. `http://localhost:3000`)

### Optional

- `LOGIN_EMAIL` — demo user email (default: `demo@example.com`)
- `LOGIN_PASSWORD` — demo user password (default: `password123`)

### Example

```bash
# Default (localhost:3000, demo credentials)
BASE_URL=http://localhost:3000 npm run smoke

# Custom credentials
BASE_URL=http://localhost:3000 LOGIN_EMAIL=demo@example.com LOGIN_PASSWORD=password123 npm run smoke
```

---

## Running

### From `tests/performance/`

```bash
cd tests/performance
npm run test        # smoke (default for CI)
npm run smoke
npm run baseline
npm run load
npm run stress
npm run spike
npm run breakpoint
npm run soak
npm run all         # smoke + baseline + load
```

### Via run script

```bash
cd tests/performance
chmod +x run.sh
BASE_URL=http://localhost:3000 ./run.sh smoke
BASE_URL=http://localhost:3000 ./run.sh all
```

### From project root

```bash
BASE_URL=http://localhost:3000 npm run tests:performance
```

---

## Endpoints Tested

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | – | Health check `{ status: "ok", timestamp }` |
| POST | `/auth/login` | – | Login → `{ access_token, user }` |
| GET | `/users` | 🔒 | List users (array) |
| GET | `/projects` | 🔒 | List projects (array) |
| GET | `/tasks` | 🔒 | List tasks `{ data: [], total, page, limit }` |

---

## Structure

```
tests/performance/
├── lib/
│   ├── config.js     # BASE_URL, endpoints, thresholds, loginPayload
│   ├── auth.js       # login() → JWT token; getRequestParams(token)
│   ├── api.js        # getHealth, postLogin, getUsers(token), getProjects(token), getTasks(token)
│   ├── scenarios.js  # VU/iteration config per test type
│   ├── summary.js    # handleSummary – HTML report generator
│   └── utils.js
├── smoke/
├── baseline/
├── load/
├── stress/
├── spike/
├── breakpoint/
├── soak/
├── data/
├── run.sh
├── .env.example
├── package.json
└── README.md
```

---

## HTML Report

Each run generates an HTML report at `k6-report/index.html` relative to the directory from which k6 is run. When using `run.sh`, the report is written to `tests/performance/k6-report/`.

---

## Backend Setup

Ensure the backend is running before tests:

```bash
cd backend
npm run start:dev
```

Seed data (demo user, projects, tasks):

```bash
npm run prisma:seed --prefix backend
```

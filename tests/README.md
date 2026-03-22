# Tests – Task Manager

Unified test suite: **E2E API**, **E2E UI**, and **performance** tests.

📖 Related: [Backend README](../backend/README.md) | [Frontend README](../frontend/README.md) | [Performance README](./performance/README.md)

---

## Structure

```
tests/
├── e2e/
│   ├── api/                    # API tests (CodeceptJS REST + AJV JSON Schema)
│   │   ├── context.ts          # Shared state: authToken, userId, projectId, taskId
│   │   ├── features/           # Gherkin .feature files
│   │   │   ├── app.feature     # Health check
│   │   │   ├── auth.feature    # Login scenarios
│   │   │   ├── users.feature
│   │   │   ├── projects.feature
│   │   │   └── tasks.feature
│   │   ├── step_definitions/
│   │   │   └── steps.ts        # Gherkin steps + Before hook (auto-auth)
│   │   └── schemas/            # AJV JSON schemas
│   │       ├── login-response.schema.json   # { access_token, user }
│   │       ├── user.schema.json
│   │       ├── project.schema.json
│   │       ├── task.schema.json
│   │       └── delete-response.schema.json
│   ├── ui/                     # UI tests (CodeceptJS + Playwright)
│   │   ├── features/
│   │   │   ├── login.feature
│   │   │   ├── logout.feature
│   │   │   ├── navigation.feature
│   │   │   ├── tasks.feature
│   │   │   ├── users.feature
│   │   │   └── projects.feature
│   │   ├── step_definitions/
│   │   │   └── steps.ts
│   │   └── pages/              # Page Object Model
│   │       ├── LoginPage.ts
│   │       ├── TasksPage.ts
│   │       ├── UsersPage.ts
│   │       └── ProjectsPage.ts
│   └── helpers/
│       ├── schema-validator.ts       # AJV compile + assertValidSchema
│       └── SchemaValidator.ts        # CodeceptJS custom helper
├── performance/                # k6 load tests → see performance/README.md
├── codecept.api.conf.ts
├── codecept.ui.conf.ts
├── output/                     # Screenshots on failure
├── allure-results/
└── package.json
```

---

## Stack

- **CodeceptJS** – BDD test framework
- **Playwright** – browser automation (UI tests)
- **TypeScript** – type safety across all tests
- **Gherkin** – human-readable scenarios
- **AJV** – JSON Schema validation (API tests)
- **Allure** – test reporting

---

## Prerequisites

1. **Install dependencies**
   ```bash
   cd tests && npm install
   ```

2. **Browsers (UI tests only)**
   ```bash
   npx playwright install chromium
   ```

3. **Running services**
   - Backend at `http://localhost:3000` — see [Backend README](../backend/README.md)
   - Frontend at `http://localhost:4200` — required for UI tests

4. **Seed data** (creates demo user, projects, tasks)
   ```bash
   npm run db:seed
   ```
   > API tests authenticate automatically using `demo@example.com` / `password123` — seed data must exist.

---

## Running

```bash
cd tests

# API tests only (no browser, backend required)
npm run test:api

# UI tests only (both frontend + backend required)
npm run test:ui

# All E2E tests
npm test
```

### Allure reports (locally)

```bash
npm run test:api:report    # API tests + open Allure report
npm run test:ui:report     # UI tests + open Allure report
npm run test:report        # All tests + open Allure report
```

### CI reports (GitHub Pages)

| Report | URL |
|--------|-----|
| **Landing** | [pavlovic-bojan.github.io/angular-nest-prisma-sdet-tm-app-poc](https://pavlovic-bojan.github.io/angular-nest-prisma-sdet-tm-app-poc/) |
| **Allure (E2E)** | [allure/](https://pavlovic-bojan.github.io/angular-nest-prisma-sdet-tm-app-poc/allure/) |
| **Performance (k6)** | [load/](https://pavlovic-bojan.github.io/angular-nest-prisma-sdet-tm-app-poc/load/) |

---

## API Tests

All backend endpoints require JWT. A `Before` hook in `steps.ts` automatically logs in before every scenario and calls `I.haveRequestHeaders({ Authorization: 'Bearer ...' })` — no manual auth step needed in feature files.

### Coverage

| Feature | Endpoints | Scenarios |
|---------|-----------|-----------|
| **App** | `GET /` | Health check `{ status: "ok" }` |
| **Auth** | `POST /auth/login` | Valid login → `{ access_token, user }`, invalid → 401 |
| **Users** | `GET/POST/PUT/DELETE /users` | CRUD, password not in response, 404 |
| **Projects** | `GET/POST/PUT/DELETE /projects` | CRUD, 404 for non-existent |
| **Tasks** | `GET/POST/PUT/DELETE /tasks` | CRUD, filter by `projectId`, 404; paginated response `{ data, total }` |

### JSON Schemas

| Schema | Validates |
|--------|-----------|
| `LoginResponse` | `{ access_token: string, user: { id, email, name, role } }` |
| `User` | `{ id, name, email, role, createdAt }` — no `password` |
| `Project` | `{ id, name, description?, createdAt }` |
| `Task` | `{ id, title, status, priority, projectId, createdAt, updatedAt }` |
| `DeleteResponse` | `{ message: string }` |

`seeResponseArrayMatchesSchema` transparently unwraps paginated `{ data: [] }` responses (tasks endpoint) before schema validation.

---

## UI Tests

End-to-end browser flows using Playwright + Gherkin + Page Object Model.

### Coverage

| Feature | Scenarios |
|---------|-----------|
| **Login** | Login page render, valid login, invalid credentials, redirect to tasks |
| **Logout** | User menu, logout, redirect to `/login` |
| **Navigation** | Tasks, Users, Projects via sidebar `data-testid` selectors |
| **Tasks** | List, Add Task drawer, create task, cancel |
| **Users** | List, Add User drawer, create user, cancel |
| **Projects** | List, Add Project drawer, create project, cancel |

### Page Objects

| Page | Selector strategy |
|------|-------------------|
| `LoginPage` | `[data-testid='login-email']`, `[data-testid='login-submit']`, etc. |
| `TasksPage` | `[data-testid='add-task-btn']`, heading, empty state |
| `UsersPage` | `[data-testid='add-user-btn']`, heading |
| `ProjectsPage` | `[data-testid='add-project-btn']`, heading |

---

## Performance Tests

k6 load tests — smoke, baseline, load, stress, spike, breakpoint, soak. Each test calls `setup()` to obtain a JWT token, then uses it for all protected endpoint requests.

See **[performance/README.md](performance/README.md)** for full details: test scenarios, VU configuration, k6 installation, environment variables, and HTML reports.

Quick run:

```bash
BASE_URL=http://localhost:3000 npm run tests:performance
```

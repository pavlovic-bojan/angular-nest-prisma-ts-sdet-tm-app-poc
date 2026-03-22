# Angular Task Manager – Frontend

Angular 18 standalone SPA for task management. Connects to the NestJS backend via JWT-authenticated REST API.

📖 Related: [Backend README](../backend/README.md) | [Tests README](../tests/README.md) | [Performance README](../tests/performance/README.md)

---

## Tech stack

- **Angular 18** – standalone components, Signals API, `input()`/`output()`
- **Angular Signals** – `signal`, `computed`, `effect` for reactive state
- **HttpClient** – `HttpInterceptorFn` (functional interceptor) for automatic Bearer token injection
- **Tailwind CSS** – styling
- **RxJS** – `firstValueFrom` for promise-based HTTP calls
- **Karma + Jasmine** – unit and component tests

## Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/           # authGuard (route protection)
│   │   ├── interceptors/     # auth.interceptor.ts – injects Authorization: Bearer
│   │   ├── models/           # User, Project, Task interfaces
│   │   └── services/         # ApiService, AuthService, UserService,
│   │                         # ProjectService, TaskService, ThemeService, LayoutService
│   ├── features/
│   │   ├── auth/             # Login (signals: isLoading, errorMessage)
│   │   ├── users/            # UserList, UserForm
│   │   ├── projects/         # ProjectList, ProjectForm
│   │   └── tasks/            # TaskList, TaskForm
│   ├── shared/
│   │   ├── components/       # Layout, Sidebar, Topbar, Drawer,
│   │   │                     # ConfirmDialog, TablePagination
│   │   └── pipes/            # StatusLabel, DateFormat
│   ├── app.component.ts
│   ├── app.config.ts         # provideHttpClient(withInterceptors([authInterceptor]))
│   └── app.routes.ts
├── environments/             # environment.ts, environment.prod.ts
└── styles.css
```

All components use `templateUrl` / `styleUrl` — no inline templates or styles.

## Authentication flow

1. `AuthService.login()` calls `POST /auth/login` → receives `{ access_token, user }`
2. Token and user stored in `localStorage` (`access_token`, `current_user`)
3. `restoreUser()` is called on service init — auth state survives page refresh
4. `authInterceptor` (`HttpInterceptorFn`) reads `access_token` from `localStorage` and injects `Authorization: Bearer <token>` on every outgoing request automatically
5. `authGuard` redirects unauthenticated users to `/login`

## Running

```bash
# Install dependencies
npm install

# Development server (http://localhost:4200)
npm start
```

Backend must be running at `http://localhost:3000` — see [Backend README](../backend/README.md).

## Environment

| File | `apiUrl` | Used for |
|------|----------|----------|
| `environment.ts` | `http://localhost:3000` | Local development |
| `environment.prod.ts` | `/api` | Production (relative, proxied) |

## Tests

```bash
# Unit and component tests (Karma/Jasmine)
npm test

# With coverage report
npx ng test --no-watch --code-coverage
```

Coverage report output: `coverage/`

| Metric | Coverage |
|--------|----------|
| Statements | ~84% |
| Branches | ~56% |
| Functions | ~72% |
| Lines | ~86% |

**Covered:** ApiService, AuthService, UserService, ProjectService, TaskService, ThemeService, LayoutService, AuthGuard, all feature and shared components, StatusLabelPipe, DateFormatPipe.

## Routes

| Path | Description | Guard |
|------|-------------|-------|
| `/login` | Login page | – |
| `/tasks` | Task list (default after login) | `authGuard` |
| `/users` | User list | `authGuard` |
| `/projects` | Project list | `authGuard` |

## Login

Demo credentials (must match backend seed data):

| Email | Password |
|-------|----------|
| demo@example.com | password123 |

## Build

```bash
# Production build
npm run build
# Output: dist/app/
```

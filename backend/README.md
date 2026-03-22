# Task Manager API

NestJS REST API for the Angular Task Manager application. Uses Prisma ORM and SQLite, JWT authentication, and rate limiting.

📖 Related: [Root README](../README.md) | [Frontend README](../frontend/README.md) | [Tests README](../tests/README.md) | [Performance README](../tests/performance/README.md)

## Tech stack

- **NestJS** 11
- **Prisma** 5 – ORM
- **SQLite** – database
- **@nestjs/jwt** + **passport-jwt** – JWT authentication
- **bcrypt** – password hashing (10 rounds)
- **@nestjs/throttler** – rate limiting (100 req / 60s)
- **@nestjs/config** – environment variable management
- **class-validator** – DTO validation
- **Swagger** – API documentation (disabled in production)

## Structure

```
src/
├── auth/
│   ├── guards/        # JwtAuthGuard
│   ├── strategies/    # JwtStrategy (passport-jwt)
│   ├── dto/           # LoginDto
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/             # User CRUD
├── projects/          # Project CRUD
├── tasks/             # Task CRUD (paginated)
├── prisma/            # Prisma service
├── common/            # HttpExceptionFilter, LoggerMiddleware
└── main.ts
```

## Environment

Copy `.env.example` and fill in values before starting:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
| `DATABASE_URL` | `file:./dev.db` | Prisma SQLite path |
| `JWT_SECRET` | – | **Required.** Secret key for JWT signing |
| `JWT_EXPIRES_IN_SECONDS` | `86400` | Token TTL (seconds) |
| `CORS_ORIGINS` | `http://localhost:4200` | Comma-separated allowed origins |

## API endpoints

All endpoints except `POST /auth/login` require a valid JWT (`Authorization: Bearer <token>`).

| Method | Endpoint      | Auth | Description                         |
|--------|---------------|------|-------------------------------------|
| GET    | /             | –    | Health check `{ status, timestamp }`|
| POST   | /auth/login   | –    | Login → `{ access_token, user }`    |
| GET    | /users        | 🔒   | List users                          |
| GET    | /users/:id    | 🔒   | User by ID                          |
| POST   | /users        | 🔒   | Create user (password hashed)       |
| PUT    | /users/:id    | 🔒   | Update user                         |
| DELETE | /users/:id    | 🔒   | Delete user                         |
| GET    | /projects     | 🔒   | List projects                       |
| GET    | /projects/:id | 🔒   | Project by ID                       |
| POST   | /projects     | 🔒   | Create project                      |
| PUT    | /projects/:id | 🔒   | Update project                      |
| DELETE | /projects/:id | 🔒   | Delete project                      |
| GET    | /tasks        | 🔒   | List tasks `{ data, total, page, limit }` |
| GET    | /tasks/:id    | 🔒   | Task by ID                          |
| POST   | /tasks        | 🔒   | Create task                         |
| PUT    | /tasks/:id    | 🔒   | Update task                         |
| DELETE | /tasks/:id    | 🔒   | Delete task                         |

## Running

```bash
# Installation
npm install

# Copy and configure environment
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Database migration
npx prisma migrate dev --name init

# Seed (demo data)
npm run prisma:seed

# Dev server
npm run start:dev
```

API: http://localhost:3000
**Swagger**: http://localhost:3000/api (development only)

## Login credentials

- **Email:** demo@example.com
- **Password:** password123

## Tests

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

**Coverage:**
- **Unit**: AuthService, UsersService, ProjectsService, TasksService, AppController
- **E2E** (20 tests): All API endpoints (auth, users, projects, tasks, Swagger)

## Prisma

```bash
npx prisma generate    # Generate client
npx prisma migrate dev # Run migrations
npx prisma studio      # Database GUI
```

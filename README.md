# Angular Task Manager

[![SDET](https://img.shields.io/badge/SDET-CodeceptJS%20%2B%20k6-blueviolet?style=flat&logo=playwright)](https://codecept.io)
[![Live](https://img.shields.io/badge/Live_Demo-green?style=flat&logo=vercel)](https://angular-nest-prisma-sdet-tm-app-poc.vercel.app/)
[![Tests](https://img.shields.io/badge/Test_Reports-angular--nest--prisma--sdet--tm--app--poc-green?style=flat&logo=github)](https://pavlovic-bojan.github.io/angular-nest-prisma-sdet-tm-app-poc/)

Task Manager application for managing tasks, users, and projects. Angular 18 + NestJS + Prisma + SQLite. JWT authentication, bcrypt password hashing, rate limiting. E2E tests (CodeceptJS + Playwright), API tests (JSON Schema + AJV), k6 performance tests.

## 📋 Table of Contents

- [Overview](#-overview)
- [SDET Skills Showcase](#-sdet-skills-showcase)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Development](#-development)
- [Testing](#-testing)
- [Login](#-login)
- [Live App & Test Reports](#-live-app--test-reports)
- [GitHub Actions (CI)](#-github-actions-ci)
- [License](#-license)
- [Topics](#-topics)

## 🎯 Overview

**Angular Task Manager** is a full-stack application that provides:

- **Task Management** – create, edit, and delete tasks
- **Project Management** – CRUD for projects
- **User Management** – user management
- **Authentication** – JWT login/logout, token persisted in localStorage
- **REST API** – NestJS backend, all endpoints JWT-protected (except login), Swagger docs

## 🎯 SDET Skills Showcase

| Skill | Implementation |
|-------|----------------|
| **E2E Testing** | CodeceptJS + Playwright + Gherkin + Page Object Model |
| **API Testing** | CodeceptJS REST + JSON Schema (AJV) validation |
| **Performance** | k6 (smoke, baseline, load, stress, spike, soak) |
| **Reporting** | Allure for E2E, HTML for k6 |

## ✨ Features

### Core Features

- ✅ **Authentication** (login/logout)
- ✅ **Tasks** – CRUD, status, priority, project, assignee
- ✅ **Projects** – CRUD
- ✅ **Users** – CRUD
- ✅ **Responsive UI** – Tailwind CSS, sidebar + topbar
- ✅ **Dark mode** support

### Technical Features

- ✅ **TypeScript** – strict mode across backend and frontend
- ✅ **JWT authentication** – passport-jwt, bcrypt (10 rounds), rate limiting
- ✅ **RESTful API** with Swagger/OpenAPI (available in production — this is a demo project)
- ✅ **SQLite** with Prisma ORM, paginated responses for tasks
- ✅ **Angular Signals** – `signal`, `computed`, `effect`, `input()`/`output()`
- ✅ **E2E tests** – CodeceptJS, Playwright, Gherkin, Page Object Model
- ✅ **API tests** – JSON Schema validation (AJV), JWT auto-auth via Gherkin Background
- ✅ **Performance tests** – k6 with JWT token setup per VU
- ✅ **Allure reporting** – GitHub Pages deploy

## 📁 Project Structure

```
angular-nest-prisma-sdet-tm-app-poc/
├── backend/              # NestJS API + Prisma + SQLite
│   ├── src/
│   │   ├── auth/         # JWT strategy, guard, login endpoint
│   │   ├── users/        # Users CRUD (bcrypt passwords)
│   │   ├── projects/     # Projects CRUD
│   │   ├── tasks/        # Tasks CRUD (paginated)
│   │   ├── prisma/       # Prisma service
│   │   └── common/       # HttpExceptionFilter, LoggerMiddleware
│   ├── prisma/           # Schema, migrations, seed
│   ├── .env.example      # Environment variables template
│   └── README.md
│
├── frontend/             # Angular 18 standalone SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/     # Auth service, JWT interceptor, guards, models
│   │   │   ├── features/ # Auth, tasks, users, projects (Signals API)
│   │   │   └── shared/   # Layout, drawer, topbar, table-pagination
│   │   └── environments/
│   └── README.md
│
├── tests/                # Test Suites
│   ├── e2e/              # CodeceptJS (API + UI)
│   │   ├── api/          # REST + JSON Schema
│   │   └── ui/           # Playwright + Page Objects
│   ├── performance/      # k6 load tests
│   └── README.md
│
├── .github/workflows/    # CI workflows
├── render.yaml           # Render backend config
└── README.md
```

## 🚀 Quick Start

**Prerequisites:** Node.js >= 20, npm

### 1. Installation

```bash
npm run install:all
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # set JWT_SECRET and other vars
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

Backend: http://localhost:3000  
Swagger: http://localhost:3000/api

### 3. Frontend

```bash
npm start
```

Frontend: http://localhost:4200

📖 [Backend README](./backend/README.md) | [Frontend README](./frontend/README.md)

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** NestJS 11
- **ORM:** Prisma 5
- **Database:** SQLite
- **Language:** TypeScript (strict)
- **Auth:** JWT (`@nestjs/jwt`, `passport-jwt`), bcrypt
- **Security:** `@nestjs/throttler` rate limiting, `@nestjs/config` env management
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest, Supertest

### Frontend

- **Framework:** Angular 18 (standalone components)
- **Language:** TypeScript (strict)
- **State:** Angular Signals (`signal`, `computed`, `effect`)
- **HTTP:** `HttpInterceptorFn` – automatic Bearer token injection
- **Styling:** Tailwind CSS
- **Forms:** Reactive Forms

### Testing

- **E2E UI:** CodeceptJS + Playwright + Gherkin + Page Object Model
- **API:** CodeceptJS REST + AJV JSON Schema, JWT auto-auth via Gherkin Background
- **Performance:** k6 — smoke, baseline, load, stress, spike, soak; JWT via `setup()`
- **Reporting:** Allure (E2E), HTML (k6)

## 💻 Development

```bash
# Backend (terminal 1)
npm run start:backend

# Frontend (terminal 2)
npm start
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Frontend dev server |
| `npm run start:backend` | Backend dev server |
| `npm run build` | Build frontend |
| `npm run build:backend` | Build backend |
| `npm test` | Frontend unit tests |
| `npm run test:backend` | Backend unit tests |
| `npm run e2e` | E2E (API + UI) |
| `npm run test:api` | API tests only |
| `npm run test:ui` | UI tests only |
| `npm run db:migrate` | Prisma migration |
| `npm run db:seed` | Seed database |
| `npm run tests:performance` | k6 performance |

## 🧪 Testing

### Test Coverage

- ✅ **Backend:** Jest unit tests (AuthService, UsersService, ProjectsService, TasksService, AppController)
- ✅ **Frontend:** Karma/Jasmine
- ✅ **API:** CodeceptJS REST + AJV JSON Schema validation, JWT auth via `Before` hook
- ✅ **E2E UI:** CodeceptJS Playwright + Gherkin + Page Object Model
- ✅ **Performance:** k6 (smoke, baseline, load, stress, spike, soak) — token from `setup()`

### Running locally

```bash
# API tests (backend must be running)
cd tests && npm run test:api

# UI tests (backend and frontend must be running)
cd tests && npm run test:ui

# Performance
BASE_URL=http://localhost:3000 npm run tests:performance
```

📖 [Tests README](./tests/README.md) | [Performance README](./tests/performance/README.md)

## 👤 Login

| Name | Email | Password | Role |
|------|-------|----------|------|
| Demo User | demo@example.com | password123 | admin |
| Jane Doe | jane@example.com | changeme | developer |
| John Smith | john@example.com | changeme | developer |

> Use `demo@example.com` for UI and API tests.

## 🌐 Live App & Test Reports

### Live Application

| Component | URL |
|-----------|-----|
| **Frontend** (Vercel) | [https://angular-nest-prisma-sdet-tm-app-poc.vercel.app/](https://angular-nest-prisma-sdet-tm-app-poc.vercel.app/) |
| **Backend API** | [https://angular-nest-prisma-sdet-tm-app-poc.onrender.com/](https://angular-nest-prisma-sdet-tm-app-poc.onrender.com/) |
| **Swagger UI** | [https://angular-nest-prisma-sdet-tm-app-poc.onrender.com/api](https://angular-nest-prisma-sdet-tm-app-poc.onrender.com/api) |

### Test Reports (GitHub Pages)

| Report | URL |
|--------|-----|
| **Landing** | [https://pavlovic-bojan.github.io/angular-nest-prisma-ts-sdet-tm-app-poc/](https://pavlovic-bojan.github.io/angular-nest-prisma-ts-sdet-tm-app-poc/) |
| **Allure** (E2E) | [allure/](https://pavlovic-bojan.github.io/angular-nest-prisma-ts-sdet-tm-app-poc/allure/) |
| **k6 Load Test** | [load/](https://pavlovic-bojan.github.io/angular-nest-prisma-ts-sdet-tm-app-poc/load/) |

Deployed after each E2E and Performance run. **Settings → Pages → Deploy from branch** → `gh-pages`.

## ⚙️ GitHub Actions (CI)

Workflows: [ci.yml](.github/workflows/ci.yml), [e2e.yml](.github/workflows/e2e.yml), [backend-ci.yml](.github/workflows/backend-ci.yml), [frontend-ci.yml](.github/workflows/frontend-ci.yml), [performance.yml](.github/workflows/performance.yml).

**Secrets** (Settings → Secrets and variables → Actions):

| Secret | Used by | Description |
|--------|---------|-------------|
| `BACKEND_URL` | E2E (production), Performance | https://angular-nest-prisma-sdet-tm-app-poc.onrender.com |
| `FRONTEND_URL` | E2E (production) | https://angular-nest-prisma-sdet-tm-app-poc.vercel.app |
| `LOGIN_EMAIL` | Performance | demo@example.com |
| `LOGIN_PASSWORD` | Performance | password123 |

## 📄 License

Proprietary – All rights reserved

## 📌 Topics

`angular` `nestjs` `prisma` `sqlite` `jwt` `codeceptjs` `playwright` `k6-io` `sdet` `e2e-testing` `api-testing` `performance-testing` `task-manager` `fullstack`

*Add to **About → Topics** on GitHub.*

---

**Status:** ✅ Production Ready

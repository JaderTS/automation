# Playwright Showcase

Production-ready test automation framework built with [Playwright](https://playwright.dev/) and TypeScript. Covers E2E UI testing (Sauce Demo) and REST API testing (JSONPlaceholder), following industry best practices used in enterprise QA teams.

[![Playwright Tests](https://github.com/jaderts/automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/jaderts/automation/actions/workflows/playwright.yml)
[![Nightly Regression](https://github.com/jaderts/automation/actions/workflows/scheduled.yml/badge.svg)](https://github.com/jaderts/automation/actions/workflows/scheduled.yml)

---

## Architecture

```
automation/
├── src/
│   ├── pages/          # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   ├── api/            # Typed API clients
│   │   └── UsersApi.ts
│   ├── fixtures/       # Custom Playwright fixtures
│   │   └── index.ts
│   └── utils/          # Shared helpers
│       ├── constants.ts
│       └── DataFactory.ts
├── tests/
│   ├── e2e/            # UI end-to-end tests
│   │   ├── login.spec.ts
│   │   ├── inventory.spec.ts
│   │   └── checkout.spec.ts
│   └── api/            # REST API tests
│       └── users.spec.ts
└── .github/workflows/  # CI/CD pipelines
    ├── playwright.yml  # On push/PR (parallel per browser)
    └── scheduled.yml   # Nightly full regression
```

## Design Decisions

| Pattern | Why |
|---|---|
| Page Object Model | Centralizes selectors; a UI change means editing one file, not hunting across specs |
| Custom fixtures | Eliminates `beforeEach` boilerplate; authentication state is injected at the fixture level |
| Typed API client | Makes API contracts explicit; TypeScript catches broken response shapes at compile time |
| DataFactory | Keeps test data out of specs; generated data avoids hardcoded values that break on env changes |
| Project per layer | UI and API share one config but run independently; no browser overhead on API jobs |

## Prerequisites

- Node.js 20+
- npm 9+

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Copy env file and adjust if needed
cp .env.example .env
```

## Running Tests

```bash
# All tests (UI across 3 browsers + API)
npm test

# UI tests only
npm run test:ui

# API tests only
npm run test:api

# Headed mode (watch browser)
npm run test:headed

# Debug mode (step through)
npm run test:debug

# Open last HTML report
npm run report
```

## CI/CD

### On Push / Pull Request

Three parallel jobs run on every push to `main` or PR:

- **UI Tests** — Chromium, Firefox, WebKit (matrix strategy, fail-fast: false)
- **API Tests** — Headless, no browser install overhead

### Nightly Regression

Scheduled at 02:00 UTC, runs the full suite across all 4 projects (Chromium, Firefox, WebKit, Mobile Chrome). Triggered manually via `workflow_dispatch` as well.

HTML reports are uploaded as GitHub Actions artifacts and retained for 14 days (nightly: 30 days).

## Test Coverage

### UI — Sauce Demo

| Suite | Scenarios |
|---|---|
| Login | Valid login, locked user, invalid credentials, empty fields |
| Inventory | Product count, add/remove cart, 4 sort modes |
| Checkout | Full purchase flow, missing field validations, continue shopping |

### API — JSONPlaceholder

| Endpoint | Scenarios |
|---|---|
| `GET /users` | 200, array length, field schema |
| `GET /users/:id` | Found, 404 not found |
| `GET /users/:id/posts` | Related resources, field presence |
| `POST /users` | Create, response shape, 201 status |
| `PUT /users/:id` | Full replace, 200 status |
| `PATCH /users/:id` | Partial update, 200 status |
| `DELETE /users/:id` | 200 no body |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | UI base URL |
| `API_BASE_URL` | `https://jsonplaceholder.typicode.com` | API base URL |
| `STANDARD_USER` | `standard_user` | Login username |
| `STANDARD_PASSWORD` | `secret_sauce` | Login password |

In CI, set these as **GitHub Actions secrets** — never commit credentials.

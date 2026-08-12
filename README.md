# Angular Projects

A monorepo of personal portfolio projects built with Angular 22, TypeScript and Vitest.

[![Ecommerce Coverage](https://github.com/rodrigocf-frontend/angular-projects/actions/workflows/ecommerce-coverage.yml/badge.svg)](https://github.com/rodrigocf-frontend/angular-projects/actions/workflows/ecommerce-coverage.yml)
[![Taskflow Coverage](https://github.com/rodrigocf-frontend/angular-projects/actions/workflows/taskflow-coverage.yml/badge.svg)](https://github.com/rodrigocf-frontend/angular-projects/actions/workflows/taskflow-coverage.yml)
[![codecov](https://codecov.io/gh/rodrigocf-frontend/angular-projects/branch/main/graph/badge.svg)](https://codecov.io/gh/rodrigocf-frontend/angular-projects)

## Projects

| Project | Description | Stack highlights |
| --- | --- | --- |
| [`ecommerce`](./ecommerce) — **Maison** | Fashion e-commerce storefront: catalog with filters/sort/pagination, product details, cart drawer, multi-step checkout | Angular 22, NgRx (Store/Effects), RxJS, Angular CDK, Reactive Forms, SCSS |
| [`taskflow`](./taskflow) — **TaskFlow** | Kanban-style task manager: multi-project boards, drag-and-drop columns, task/project modals | Angular 22, Signals, Angular CDK Drag & Drop, RxJS, Reactive Forms |
| [`taskflow-api`](./taskflow-api) | Backend API for TaskFlow (early-stage scaffold) | ASP.NET Core |

Each Angular project is self-contained — its own `package.json`, `pnpm-lock.yaml`, test suite and README — and runs independently. See each project's README (linked above) for architecture notes, features and setup instructions.

## Running a project

```bash
cd ecommerce   # or taskflow
pnpm install
pnpm start
```

Both apps serve on `http://localhost:4200` and expect a local `json-server` API (`pnpm db:start` in `ecommerce`, `pnpm db-start` in `taskflow`) on `http://localhost:3000`.

## Testing & Coverage

Both Angular projects use Vitest via Angular's `@angular/build:unit-test` builder, with coverage reported through `@vitest/coverage-v8`:

```bash
pnpm test              # run once
pnpm test:coverage     # run with a coverage report (text + html + lcov)
```

A GitHub Actions workflow per project (`.github/workflows/ecommerce-coverage.yml`, `.github/workflows/taskflow-coverage.yml`) runs the suite and uploads the `lcov` report to [Codecov](https://codecov.io) — scoped by path, so a change in one project doesn't trigger the other's pipeline. Coverage is split by Codecov flag (`ecommerce`, `taskflow`).

## Repository Structure

```
angular-projects/
├── .github/
│   └── workflows/
│       ├── ecommerce-coverage.yml   # Test + Codecov upload for ecommerce/
│       └── taskflow-coverage.yml    # Test + Codecov upload for taskflow/
├── ecommerce/                       # Maison — e-commerce storefront
├── taskflow/                        # TaskFlow — Kanban task manager
└── taskflow-api/                    # TaskFlow backend (.NET, work in progress)
```

## Author

**Rodrigo Cunha** — Developer
[GitHub](https://github.com/rodrigocf-frontend)

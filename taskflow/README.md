# TaskFlow

A Kanban-style task management app built as a portfolio project, focused on modern Angular best practices.

## Overview

TaskFlow lets you organize tasks across status columns (To Do, In Progress, Done) with priority levels, filters, and automatically computed progress. The layout is designed to demonstrate component architecture, reactivity with Signals, and REST API integration.

## Tech Stack

- **Angular 22** — standalone components, Signals, computed state
- **TypeScript 6** — strict typing
- **RxJS** — streams for API communication
- **Angular HttpClient** — REST integration with error handling
- **Angular CDK** — drag and drop between Kanban columns
- **SCSS** — design tokens, theme system via partials
- **json-server** — fake REST API for local development
- **Vitest** — unit testing
- **Prettier + Husky** — formatting and git hooks
- **pnpm** — package management

## Features

- Kanban board with 3 columns and drag and drop
- Task cards with priority (high / medium / low) and due date
- Overdue task indicator
- Overall progress bar computed via `computed()` signal
- Loading overlay while fetching data from the API
- Snackbar notifications for error feedback
- Status bar showing API state and current branch
- Environment-based API URL (dev vs production)

## Running Locally

**Prerequisites:** Node.js 20+, pnpm

```bash
# Install dependencies
pnpm install

# Start the fake API (port 3000)
pnpm db-start

# Start the Angular app (port 4200)
pnpm start
```

Open `http://localhost:4200` in your browser. The API will be available at `http://localhost:3000`.

## Scripts

| Command | Description |
|---|---|
| `pnpm start` | Angular dev server |
| `pnpm db-start` | json-server locally (port 3000) |
| `pnpm db-start:render` | json-server for Render deployment |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests with Vitest |

## Project Structure

```
src/
├── app/
│   ├── components/       # Shared components (sidebar, topbar...)
│   ├── pages/            # Routed views (board, list...)
│   └── services/         # TaskService, ProjectService
└── themes/
    ├── _tokens.scss      # Design tokens (colors, radii, spacing)
    ├── _fonts.scss       # Inter font import
    └── _utils.scss       # Utility classes
```

## Author

**Rodrigo Cunha** — Mid-level Developer  
[GitHub](https://github.com/rodrigocf-frontend)

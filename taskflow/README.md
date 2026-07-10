# TaskFlow

A Kanban-style task management app built as a portfolio project, focused on modern Angular best practices.

## Overview

TaskFlow lets you manage multiple projects, each with its own task board. Tasks are organized across three status columns (To Do, In Progress, Done) and can be dragged between them. The sidebar shows real-time progress computed directly from the loaded tasks via Angular Signals.

## Tech Stack

- **Angular 22** — standalone components, Signals, computed state, `effect()`
- **TypeScript 6** — strict typing
- **RxJS** — streams for HTTP communication
- **Angular HttpClient** — REST integration with error handling
- **Angular CDK** — drag and drop between Kanban columns
- **Reactive Forms** — form creation with validation (`FormGroup`, `FormControl`, `Validators`)
- **SCSS** — design tokens, theme system via partials
- **json-server** — fake REST API for local development
- **Vitest** — unit testing
- **Prettier + Husky** — formatting and git hooks
- **pnpm** — package management

## Features

- Multi-project support — switch between projects in the sidebar
- Kanban board with 3 columns and drag and drop
- Task editing — click any card to open the pre-filled edit form
- Task creation and editing modal with Reactive Forms (title, description, priority, status, tag, due date)
- Project creation modal with color picker and Reactive Forms
- My Tasks page — personal task list grouped by status with progress summary
- Task cards with priority levels (high / medium / low) and due date indicators
- Overdue task indicator per card
- Real-time progress bar and task counts computed via `computed()` signals
- Loading overlay while fetching data from the API
- Snackbar notifications for success and error feedback
- Lazy loading routes with `loadComponent` and deferred modals with `@defer`
- Environment-based API URL (dev vs. production)

## Architecture Decisions

### Signals over NgRx
State is managed with Angular Signals (`signal`, `computed`, `effect`) instead of NgRx. For a project of this scope, signals provide reactive state without the boilerplate of actions, reducers, and selectors.

### Effect for project → task binding
When the selected project changes in `ProjectService`, an `effect()` in `SidebarComponent` automatically calls `TaskService.readTasks(projectId)`. This keeps the board in sync without explicit wiring between components.

### Global modal pattern
`FormNewProject` and `FormNewTask` are mounted at the root `AppComponent` level and controlled via service signals (`visible`, `open()`, `close()`). This avoids z-index issues and keeps the modals outside the component tree that triggers them.

### Flat service state (no store)
Each service owns its own signals and exposes them as readonly. Components read from signals directly — no facade or store layer needed at this scale.

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
│   ├── components/
│   │   ├── board-table/        # Kanban columns with CDK drag-drop
│   │   ├── form-new-project/   # Project creation modal
│   │   ├── form-new-task/      # Task creation modal
│   │   ├── sidebar/            # Navigation, project list, progress
│   │   ├── top-bar/            # Header with nova tarefa button
│   │   └── ui/                 # Avatar, Button, Icon, Snackbar
│   ├── pages/
│   │   ├── board/              # Main Kanban view
│   │   ├── my-tasks/           # Personal task list grouped by status
│   │   ├── calendar/           # Placeholder
│   │   └── reports/            # Placeholder
│   └── services/
│       ├── loading-service/    # Global loading state
│       ├── project-service/    # Project CRUD + selected project signal
│       ├── snack-service/      # Toast notification service
│       ├── task-service/       # Task CRUD + column signals + edit state
│       └── user-service/       # Current user identity signal
└── themes/
    ├── _tokens.scss            # Design tokens (colors, radii, spacing)
    ├── _fonts.scss             # Inter font import
    └── _utils.scss             # Utility classes
```

## Author

**Rodrigo Cunha** — Mid-level Developer  
[GitHub](https://github.com/rodrigocf-frontend)

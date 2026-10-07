# Gym App

A workout management app for gym members and personal trainers, built as a portfolio project focused on Clean Architecture in Angular.

> Early stage: the domain, data layer, landing page and Google sign-in are in place; the workout screens are not built yet.

## Overview

Gym App models two kinds of users — gym members and personal trainers — and the workouts a trainer assigns to a member, each made of exercises with series, repetitions, load and rest. Data is persisted in Supabase (Postgres) and users sign in with Google through Supabase Auth. The code is split into a `domain` layer that holds the business rules, a `data` layer that talks to Supabase and a `presentation` layer with the pages, with domain and data connected through repository contracts.

## Tech Stack

- **Angular 22** — standalone components, `inject()`-based dependency injection
- **TypeScript 6** — strict typing
- **Supabase** — Postgres database accessed through `@supabase/supabase-js`, with row types generated into `database.types.ts`
- **Supabase Auth** — Google OAuth sign-in
- **Supabase CLI** — local project config (`supabase/config.toml`) and schema pulls
- **Angular Material** — Material 3 theme
- **Angular Router** — lazy-loaded pages with `loadComponent`
- **SCSS** — component and global styles
- **Vitest** — unit testing via Angular's `@angular/build:unit-test` builder
- **Prettier** — formatting
- **pnpm** — package management

## Features

- Landing page (`/home`) — responsive hero banner with configurable texts, photo and services list
- Login page (`/login`) — sign in with Google
- Lazy-loaded routes, with unknown paths redirected to the landing page
- Domain errors for creating a gym user (`GymUserAlreadyExistsError`, `GymUserPersistenceError`), translated from Supabase errors in the repository
- Gym user entity with two roles (`gymMember` / `personalTrainer`) and an optional link to a personal trainer
- Workout and exercise entities (series, repetitions, optional load and rest)
- Create gym user use case, persisted to the `tb_gym_users` table
- Supabase-backed repository with a DTO and mapper between the entity and the table row
- Environment-based Supabase URL and publishable key

## Architecture Decisions

### Domain and data layers split by a repository contract

`domain/` holds entities, use cases and the `GymUsersRepository` contract; `data/` holds the Supabase implementation, the DTO and the mapper. The domain never imports from `data/` or from `@supabase/supabase-js` — swapping Supabase for another backend means writing a new repository class and changing one provider.

### Abstract class as the injection token

`GymUsersRepository` is an `abstract class` rather than an `interface`. Interfaces are erased at compile time and can't be used as Angular DI tokens; an abstract class is both the contract and the token, so `app.config.ts` binds it with a single `{ provide: GymUsersRepository, useClass: SupabaseGymUsersRepositoryImpl }` and no `InjectionToken` is needed.

### Use cases are Angular injectables

Use cases are decorated with `@Injectable` and resolve their repository with `inject()`. This couples the domain to `@angular/core`, a deliberate trade-off: the domain isn't meant to be reused outside Angular, and letting the framework wire use cases avoids a hand-written factory provider for each one.

### Supabase errors become domain errors in the repository

The repository is the only place that reads Supabase error codes: a unique violation (`23505`) is thrown as `GymUserAlreadyExistsError` and anything else as `GymUserPersistenceError`, which keeps the original error as its `cause`. Callers branch on the error class with `instanceof` and never see a Postgres message.

### DTOs derived from the generated database types

`GymUserDTO` is derived from `Database['public']['Tables']['tb_gym_users']['Row']` in `database.types.ts` instead of being written by hand, so a schema change surfaces as a compile error in the mapper rather than as a runtime failure.

### Tests live outside `src/`

Specs sit in a top-level `tests/` folder that mirrors the `src/` tree, instead of being co-located with the code. `angular.json`'s `test` target and `tsconfig.spec.json` both point at `tests/**/*.spec.ts`.

## Running Locally

**Prerequisites:** Node.js 20+, pnpm, a Supabase project

```bash
# Install dependencies
pnpm install

# Create the environment files (ignored by git) and fill in your Supabase URL and publishable key
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.development.ts

# Start the Angular app (port 4200)
pnpm start
```

Open `http://localhost:4200` in your browser.

Signing in requires the Google provider to be enabled in your Supabase project (Authentication → Providers).

The files under `src/environments/` are not committed — only `environment.example.ts` is. `environment.ts` is used by production builds and `environment.development.ts` replaces it in development.

## Scripts

| Command        | Description                     |
| -------------- | ------------------------------- |
| `pnpm start`   | Angular dev server              |
| `pnpm build`   | Production build                |
| `pnpm watch`   | Development build in watch mode |
| `pnpm test`    | Unit tests with Vitest          |
| `pnpm db-pull` | Pull the remote Supabase schema |

## Testing

Unit tests cover the entities, the create gym user use case, the mapper, the Supabase repository, the routes, the home and login pages and the root component, run with Vitest through Angular's `@angular/build:unit-test` builder.

```bash
pnpm test              # watch mode
pnpm test --watch=false   # run once
```

No spec reaches Supabase: wherever a client is created (the repository, the login page and the root component), it is replaced with a fake before it is used.

## Project Structure

```
gym-app/
├── src/
│   ├── app/
│   │   ├── domain/
│   │   │   ├── entities/           # GymUser, GymWorkout, GymExercise
│   │   │   ├── errors/             # GymUserAlreadyExistsError, GymUserPersistenceError
│   │   │   ├── repositories/       # GymUsersRepository — contract and DI token
│   │   │   └── usecases/           # CreateGymUserCase
│   │   ├── data/
│   │   │   ├── models/             # GymUserDTO, derived from the generated database types
│   │   │   ├── mappers/            # GymUserMapper — entity to table row
│   │   │   └── repositories/       # SupabaseGymUsersRepositoryImpl
│   │   ├── presentation/
│   │   │   └── pages/
│   │   │       ├── home/           # Landing page with the hero banner
│   │   │       └── login/          # Google sign-in
│   │   ├── app.config.ts           # Binds repository contracts to their implementations
│   │   ├── app.routes.ts           # Lazy-loaded routes
│   │   └── app.ts                  # Root component with the router outlet
│   └── environments/
│       └── environment.example.ts  # Template for the git-ignored environment files
├── public/
│   └── banner.webp                 # Hero photo
├── tests/                          # Specs, mirroring the src/ tree
├── supabase/
│   └── config.toml                 # Supabase CLI project config
└── database.types.ts               # Types generated from the Supabase schema
```

## Author

**Rodrigo Cunha** — Developer
[GitHub](https://github.com/rodrigocf-frontend)

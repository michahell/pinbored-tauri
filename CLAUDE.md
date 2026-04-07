# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pinbored** is a Tauri v2 desktop application wrapping an Angular 21 frontend. It lets users manage their [Pinboard](https://pinboard.in) bookmarks — browsing, tagging, and detecting stale (broken) links by performing HTTP checks on each bookmark in a concurrency-limited queue.

## Commands

### Development
```bash
npm start           # Angular dev server (no CORS proxy needed — Tauri handles HTTP)
npm run tauri dev   # Full Tauri desktop app (Rust + Angular)
```

### Build
```bash
npm run tauri build # Production desktop build
npm run watch       # Angular watch mode (development)
```

### Testing
```bash
ng test                                  # Run all unit tests (Vitest)
ng test --watch=false --code-coverage    # Single run with coverage
```

### Lint
```bash
ng lint
```

## Architecture

### Tauri Integration
- HTTP requests to external URLs (Pinboard API, bookmark staleness checks) go through **`@tauri-apps/plugin-http`** `fetch`, not the browser's `fetch`. This bypasses CORS and is required for the app to work.
- Rust backend (`src-tauri/`) is minimal — it exposes a `greet` command but core logic lives in Angular.
- Tauri plugin permissions are configured in `src-tauri/capabilities/`.

### Service Layer
Two-layer service pattern for Pinboard data:
- **`Pinboard`** (`services/pinboard/pinboard.ts`) — low-level API client. Stores credentials (`user`/`password` as class properties, not signals). Makes raw API calls using Tauri's `fetch`.
- **`PinboardFacade`** (`services/pinboard/pinboard-facade.ts`) — maps raw API responses to view models (`PinboardItemVM`), adding `tagsList` and `status` fields.
- **`StaleChecker`** (`services/stale-checker/stale-checker.ts`) — runs bookmark URL checks with `p-queue` (concurrency: 4) and `p-map` iterable, calling an update handler per result.

### View Models
- `PinboardItem` (raw API shape) → `PinboardItemVM` (adds `tagsList: string[]` and `status: PinboardItemVMStatus`)
- `PinboardItemVMStatus`: `'unchecked' | 'checking' | 'ok' | 'maybe-stale' | 'stale'`

### UI Components
- **spartan-ng/helm** — headless/styled component library (shadcn-style). Components are imported from `@spartan-ng/helm/<component>` (e.g. `HlmButton`, `HlmSpinner`).
- **TanStack Angular Table** (`@tanstack/angular-table`) — used for the stale-check results table (`StaleTable` component). Table state (sorting, filters, row selection) is managed via signals.
- **ng-icons** with Lucide icon set.
- **Tailwind CSS v4** for styling.

### Pages
Routes are lazy-loaded via `loadComponent`:
- `/login` — credential entry
- `/bookmarks` — browse all bookmarks
- `/tags` — tag management
- `/stale` — fetch bookmarks then run staleness checks

### Component Structure
- Standalone components only, `ChangeDetectionStrategy.OnPush`
- Signals for local state; `computed()` for derived state
- `inject()` function for DI (no constructor injection)
- Native control flow: `@if`, `@for`, `@switch` — never `*ngIf`/`*ngFor`
- Prefer `protected readonly` for signal/computed properties used in templates
- Pages use `export default class` (required for `loadComponent`)

### File Organization
```
src/app/
  app.ts / app.html / app.css    # Root component
  app.config.ts                  # Providers
  app.routes.ts                  # Route definitions
  models/                        # Shared interfaces and types
  services/<feature>/            # Service + spec per feature
  components/<feature>/          # Shared/reusable components
    components/                  # Sub-components (e.g. table cell renderers)
  pages/<route>/                 # Page-level components
src-tauri/                       # Rust/Tauri backend
```

## Testing

Uses Vitest via `@angular/build:unit-test`. Test files are `*.spec.ts` co-located with their source.

To run a single test file:
```bash
ng test --include='**/stale-checker-service.spec.ts'
```

## Code Style

- Strict TypeScript, no `any`
- Single quotes
- Prettier with `printWidth: 100`
- Private class fields use `#` prefix (not `private` keyword) for encapsulation

# AGENTS.md

Project context and coding guidelines for AI agents working in this repository.

## Project Overview

**Pinbored** is a Tauri v2 desktop application wrapping an Angular 21 frontend. It lets users manage their [Pinboard](https://pinboard.in) bookmarks — browsing, tagging, and detecting stale (broken) links by performing HTTP checks on each bookmark in a concurrency-limited queue.

**Key technologies:** Angular 21, Tauri v2 (Rust), TypeScript (strict), Signals, TanStack Angular Table, spartan-ng/helm, Tailwind CSS v4, Lucide Icons via ng-icons, Vitest.

## Commands

### Development
```bash
pnpm start          # Angular dev server (no CORS proxy needed — Tauri handles HTTP)
pnpm tauri dev      # Full Tauri desktop app (Rust + Angular)
```

### Build
```bash
pnpm tauri build    # Production desktop build
pnpm run watch      # Angular watch mode
```

### Testing
```bash
pnpm test                                              # Run all unit tests (Vitest)
pnpm test -- --code-coverage                           # Single run with coverage
ng test --include='**/stale-checker-service.spec.ts'   # Single file
```

### Lint
```bash
pnpm lint
```

## Architecture

### Data-providers
To be able to make the app data-backend agnostic, 
the idea is to have a number of supported data-backends in 
`src/app/shared/data-providers`. 
The `Pinboard` data provider is the default one and contains all the services, 
facades, models and utils to be able to interface with the Pinboard.in service.

An SQLite data provider (using the @tauri-sql plugin) is planned 
for a future version to be able to support independence from Pinboard.in 
and support (sovereign) data-portability.

The app should use a data provider service to remove knowledge of data provider specifics. 
Data providers should therefore conform to a shared abstract data provider interface.

### Tauri Integration
- HTTP requests to external URLs go through **`@tauri-apps/plugin-http`** `fetch`, not the browser's `fetch`. This bypasses CORS and is required for the app to work.
- Rust backend (`src-tauri/`) should remain minimal. Preferably, TypeScript variants of Tauri plugins are used.
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
- **spartan-ng/helm** — headless/styled component library (shadcn-style). Import from `@spartan-ng/helm/<component>` (e.g. `HlmButton`, `HlmSpinner`).
- **TanStack Angular Table** (`@tanstack/angular-table`) — used for the stale-check results table (`StaleTable` component). Table state (sorting, filters, row selection) is managed via signals.
- **ng-icons** with Lucide icon set.
- **Tailwind CSS v4** for styling.

### Pages
Routes are lazy-loaded via `loadComponent`:
- `/login` — credential entry
- `/bookmarks` — browse all bookmarks
- `/tags` — tag management
- `/stale` — fetch bookmarks then run staleness checks

## Component Structure

- Standalone components only — no `NgModules`
- `ChangeDetectionStrategy.OnPush` does NOT need to be added because this is the default in Angular 21+
- `inject()` function for DI — no constructor injection
- `export default class` for pages (required for `loadComponent`)
- Prefer `protected readonly` for signal/computed properties used in templates
- Prefer the `host` property in `@Component` over `@HostBinding`/`@HostListener`
- Templates and styles MUST use paths relative to the component TypeScript file

## State Management (Signals)

- Use `signal()`, `computed()`, `input()`, and `output()`
- Use `computed()` for all derived state
- Mutate via `.set()` or `.update()` — never the deprecated `.mutate()`

## Template Rules

- Native control flow only: `@if`, `@for`, `@switch` — never `*ngIf`, `*ngFor`, `*ngSwitch`
- Use `class` and `style` property bindings instead of `ngClass`/`ngStyle`
- No arrow functions in templates
- Do not assume global objects like `new Date()` are available in templates
- Use `async` pipe for observables

## Testing

Uses Vitest via `@angular/build:unit-test`. Test files are `*.spec.ts` co-located with their source.

Standard pattern:
```ts
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Accessibility

- All components must pass AXE checks
- Follow WCAG AA minimums (focus management, color contrast, ARIA attributes)
- Use semantic HTML elements

## Code Style

- Strict TypeScript, no `any`
- Single quotes
- Prettier with `printWidth: 100`
- Private class fields use `#` prefix (not `private` keyword) for encapsulation
- Explicit component imports (no barrel re-exports)

## File Organization

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
libs/ui/                         # Local spartan/ui Helm components
src-tauri/                       # Rust/Tauri backend
```

## Development Checklist
- [ ] `ChangeDetectionStrategy.OnPush` is removed everywhere
- [ ] `inject()` used for all dependencies
- [ ] Native control flow (`@if`, `@for`) used in templates
- [ ] Templates/styles use relative paths
- [ ] No `any` types
- [ ] Components pass accessibility checks (AXE/WCAG AA)

<!-- BACKLOG.MD MCP GUIDELINES START -->

<CRITICAL_INSTRUCTION>

## BACKLOG WORKFLOW INSTRUCTIONS

This project uses Backlog.md MCP for all task and project management activities.

**CRITICAL GUIDANCE**

- If your client supports MCP resources, read `backlog://workflow/overview` to understand when and how to use Backlog for this project.
- If your client only supports tools or the above request fails, call `backlog.get_backlog_instructions()` to load the tool-oriented overview. Use the `instruction` selector when you need `task-creation`, `task-execution`, or `task-finalization`.

- **First time working here?** Read the overview resource IMMEDIATELY to learn the workflow
- **Already familiar?** You should have the overview cached ("## Backlog.md Overview (MCP)")
- **When to read it**: BEFORE creating tasks, or when you're unsure whether to track work

These guides cover:
- Decision framework for when to create tasks
- Search-first workflow to avoid duplicates
- Links to detailed guides for task creation, execution, and finalization
- MCP tools reference

You MUST read the overview resource to understand the complete workflow. The information is NOT summarized here.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD MCP GUIDELINES END -->

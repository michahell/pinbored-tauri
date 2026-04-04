# Pinbored Tauri - Project Context & Guidelines

This project is a Pinboard client built with Tauri (v2) and Angular (v21+). It focuses on high-performance reactive patterns using Angular Signals and a Rust-powered backend.

## Project Overview

- **Frontend:** Angular v21, Standalone Components, Signals for state management, Tailwind CSS v4, and [spartan/ui](https://spartan.ng) (Helm) components.
- **Backend:** Tauri v2 (Rust).
- **Functionality:** Interaction with the Pinboard.in API via the `@tauri-apps/plugin-http` plugin to bypass CORS and manage networking.
- **Key Technologies:** TypeScript (Strict Mode), Signals, `inject()` for DI, TanStack Table (Angular version), Lucide Icons.

## Building and Running

The project uses `pnpm` as the primary package manager.

### Development
```bash
# Start the Tauri development window (automatically runs pnpm start)
pnpm tauri dev

# Start frontend development server only
pnpm start
```

### Build
```bash
# Build the production application (creates native installers)
pnpm tauri build

# Build frontend only (production)
pnpm build

# Build frontend with watch mode (development)
pnpm run watch
```

### Testing & Linting
```bash
# Run all unit tests (using Vitest)
pnpm test

# Run tests with coverage
pnpm test -- --code-coverage

# Run ESLint
pnpm lint
```

## Architecture & Conventions

### Component Structure
- **Standalone Only:** No `NgModules`. All components, directives, and pipes must be standalone.
- **Change Detection:** Always set `ChangeDetectionStrategy.OnPush` in `@Component`.
- **File Organization:** Templates and styles MUST use paths relative to the component TypeScript file.
- **Dependency Injection:** Use the `inject()` function instead of constructor injection.
- **Routing:** Routes are in `src/app/app.routes.ts`. Feature routes should be lazy-loaded.
- **Host Bindings:** Prefer the `host` property in the `@Component` decorator over `@HostBinding` or `@HostListener`.

### State Management (Signals)
- **Native Signals:** Use `signal()`, `computed()`, `input()`, and `output()`.
- **Derived State:** Use `computed()` for all derived values.
- **Mutations:** Use `.set()` or `.update()`. **NEVER** use the deprecated `.mutate()`.

### Template Rules
- **Native Control Flow:** Use `@if`, `@for`, `@switch`. Do **NOT** use `*ngIf`, `*ngFor`, or `*ngSwitch`.
- **Bindings:** Use `class` and `style` property bindings instead of `ngClass` and `ngStyle`.
- **Template Logic:** Keep templates simple. Do **NOT** use arrow functions in templates.
- **Globals:** Do **NOT** assume global objects like `new Date()` are available in templates.
- **Pipes:** Use `async` pipe for observables.

### Testing Pattern
Unit tests use `TestBed` and `Vitest`. Each component should have a `*.spec.ts` file following this pattern:
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

### Accessibility (A11y)
- All components **MUST** pass AXE checks.
- Follow WCAG AA minimums (focus management, color contrast, ARIA attributes).
- Use semantic HTML elements.

## Code Style
- **TypeScript:** Strict mode with **no `any`** types.
- **Strings:** Use single quotes.
- **Formatting:** Prettier is configured (printWidth: 100).
- **Imports:** Component imports should be explicit.

## Directory Structure

- `src/app/components/`: Feature-specific components.
- `src/app/pages/`: Main application views/routes.
- `src/app/services/`: Core logic and API clients.
- `libs/ui/`: Local [spartan/ui](https://spartan.ng) Helm components.
- `src-tauri/`: Rust backend and Tauri configuration.

## Development Checklist
- [ ] Ensure `ChangeDetectionStrategy.OnPush` is set.
- [ ] Use `inject()` for all dependencies.
- [ ] Use native control flow (`@if`, `@for`).
- [ ] Templates/Styles use relative paths.
- [ ] No `any` types used.
- [ ] Components pass accessibility checks (AXE/WCAG AA).

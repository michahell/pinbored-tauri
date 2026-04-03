# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 21 application using standalone components and signals for reactive state management. The project is set up with TypeScript strict mode and uses Vitest for testing.

## Commands

### Development
```bash
# Start development server with Angular CLI
ng serve

# Start development server with local CORS proxy (used for API access)
npm start
```

### Build
```bash
# Build for production
ng build

# Build for development with watch mode
npm run watch
```

### Testing
```bash
# Run all unit tests
ng test

# Test with coverage
ng test --watch=false --code-coverage
```

## Architecture

### Component Structure
- **Standalone components only** - No NgModules (default in Angular v20+)
- Components use native control flow (`@if`, `@for`) instead of structural directives
- ChangeDetectionStrategy is set to OnPush in @Component decorators
- Templates and styles use paths relative to the component TypeScript file

### State Management
- **Signals** are used for local component state
- Use `computed()` for derived state
- State mutations use `update()` or `set()`, never `mutate()`

### Dependency Injection
- Use `inject()` function instead of constructor injection
- Services use `providedIn: 'root'` for singleton pattern

### Routing
- Routes are defined in `src/app/app.routes.ts`
- Feature routes should be lazy-loaded using loadChildren or route groups

## File Organization

- `src/app/app.ts` - Root component (app-root)
- `src/app/app.config.ts` - Application configuration with providers
- `src/app/app.routes.ts` - Route definitions
- `src/app/services/` - Feature services (e.g., CocktailService)
- `src/app/components/` - Feature components (grouped by feature)
  - Each component has its own folder with:
    - `*.ts` - Component class
    - `*.html` - Template (relative to TS file)
    - `*.css` - Styles (relative to TS file)
    - `*.spec.ts` - Unit tests

## Key Angular v21+ Patterns

### Component Definition
```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.html',  // Relative to TS file
  styleUrl: './example.css',     // Relative to TS file
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example {
  protected readonly count = signal(0);

  increment() {
    this.count.update(c => c + 1);
  }
}
```

### Service Definition
```ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MyService {
  private http = inject(HttpClient);

  getData(): Observable<Data> {
    return this.http.get<Data>(url);
  }
}
```

### Component Inputs/Outputs
```ts
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.html',
})
export class Example {
  // Input using signal
  readonly data = input.required<string>();

  // Output using signal
  readonly itemSelected = output<string>();
}
```

## Accessibility Requirements

- All components MUST pass AXE checks
- Follow WCAG AA minimums including focus management, color contrast, and ARIA attributes
- Use semantic HTML elements
- Ensure keyboard navigation works for all interactive elements

## Template Rules

- Use native control flow: `@if`, `@for`, `@switch`
- Do NOT use `*ngIf`, `*ngFor`, `*ngSwitch`
- Use `async` pipe for observables
- Do NOT use arrow functions in templates
- Do NOT assume global objects like `new Date()` are available
- Use `class` and `style` bindings instead of `ngClass` and `ngStyle`
- Prefer inline templates for small, focused components

## Testing

Unit tests use TestBed and are configured through `@angular/build:unit-test`. Each component should have a corresponding `.spec.ts` file following the pattern:
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

## Code Style

- Strict TypeScript with no `any` types
- Single quotes for strings
- Prettier configured with printWidth: 100
- Component imports should be explicit
- Use modern Angular syntax and avoid deprecated patterns

## External Resources

- [Angular Components](https://angular.dev/essentials/components)
- [Angular Signals](https://angular.dev/essentials/signals)
- [Angular Templates](https://angular.dev/essentials/templates)
- [Angular Dependency Injection](https://angular.dev/essentials/dependency-injection)
- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Testing](https://angular.dev/guide/testing)
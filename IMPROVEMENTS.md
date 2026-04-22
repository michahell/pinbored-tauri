# Improvements

_Last updated: 2026-04-22_

This document lists concrete improvement areas for the pinbored-tauri project, based on an audit against Angular 21 best practices and current test coverage.

---

## Critical — Architecture & Performance

### 1. Remove `standalone: true` from all component decorators
Angular 20+ makes standalone the default. Explicitly setting `standalone: true` is redundant and clutters decorators.

---

### 2. Move constructor side effects to `ngOnInit`
Two components run initialization logic in the constructor:
- `app.ts` — creates an `effect()` in the constructor for theme initialization
- `tag-edit-modal.ts` — calls `signal.set()` in the constructor

Side effects belong in `ngOnInit`, not constructors.

---

### 3. Fix mutable state update in `BookmarksService`
`bookmarks-service.ts` directly mutates an array element:
```ts
bookmarkInList.status = 'checking';
```
Signals require immutable updates. Use `update()` and map over the array to produce a new reference.

---

### 4. Encapsulate `BookmarksService.queue`
The `queue` property on `BookmarksService` is public and accessed directly in `bookmarks.ts`, bypassing encapsulation. Expose only what's needed via computed signals (e.g. `isPaused`, `queueSize`, `pendingCount`).

---

## High — Error Handling

### 5. Add error state signals to services
The following services have no error state — failures are either silently swallowed or reduce to empty arrays with no user feedback:
- `AuthenticationService` — no error signal; only `authStatus`
- `BookmarksService` — sets `bookmarks` to `[]` on failure without signalling an error
- `TagsService` — no error state from facade calls

Add an `error = signal<string | null>(null)` to each, populated on failure.

---

### 6. Fix `FetchService` — no HTTP error handling
`fetch-service.ts` only manages the progress bar. It does not check `response.ok`, handle non-2xx status codes, or propagate errors to callers. Any failed API call silently continues.

---

### 7. Fix `StaleCheckerService` — silent catch
The stale checker catches errors and returns `null` for the result without any logging:
```ts
catch (error) { return [pinboardItem, null]; }
```
At minimum, log the error. Ideally, set an error status on the bookmark.

---

### 8. Fix `LocalStoreService` — no error handling
All `store.get()` and `store.set()` calls are awaited without try/catch. A corrupted store silently breaks the app.

---

### 9. Fix authentication guard — no redirect on error
`is-authenticated-guard.ts` catches errors and returns `false` without redirecting or logging. The user ends up stuck with no feedback. Redirect to `/login` and optionally log the error.

---

## High — Type Safety

### 10. Replace `any` in `LocalStoreService` and model
- `LocalStoreService.set(key, value: any)` — should be `unknown` or a generic `<T>`
- `local-store-model.ts` uses `[key: string]: any` — replace with `Record<string, unknown>` or a typed interface

---

### 11. Fix `AuthenticationService.logout()` — incomplete cleanup
`logout()` clears local store credentials but does not clear the credentials stored on `PinboardService` (`storedUsername`, `storedToken`). After logout, the service still holds stale credentials in memory.

---

## Medium — Code Quality

### 12. Remove unused code from `app.ts`
- `greet()` method is never called
- `value` signal is never read

Both are dead code left over from the Tauri scaffold. Remove them.

---

### 13. Add form validators to the login form
`login.ts` creates a `FormGroup` with no validators. Both `username` and `password` fields should have `Validators.required` at minimum. The submit button should be disabled while the form is invalid.

---

### 14. Do not use `ngClass` — use `class` bindings
Per Angular 21 best practices, `ngClass` should be replaced with direct `class` bindings. Search for any remaining `[ngClass]` usages and convert them.

---

### 15. Do not use `@HostBinding` / `@HostListener`
Per Angular 21 best practices, these decorators should be replaced with the `host` object in `@Component`/`@Directive`. Check all components and directives.

---

### 16. Extract magic numbers to constants
- `StaleCheckerService` — concurrency hardcoded to `4`
- `BookmarksTable` — default page size hardcoded to `9`

Move these to named constants so they're easy to find and change.

---

### 17. Complete or remove stub pages
Three pages are empty stubs with no functionality:
- `pages/bookmark/bookmark.ts` — bookmark detail view
- `pages/tag/tag.ts` — tag detail view
- `pages/notes/notes.ts` — notes page

Either implement them or remove the route and component until ready.

---

## Unit Test Coverage

### 18. No tests for `TagsService`
`tags-service.ts` contains the full CRUD logic for tag management including optimistic updates and LocalStore persistence. It has no spec file.

---

### 19. No tests for `TagEditStateService`
`tag-edit-state-service.ts` manages edit modal state. No spec file exists.

---

### 20. No tests for table renderer components
The following small components have no spec files:
- `CellBookmark`
- `CellTagRenderer`
- `CellTagsRenderer`
- `TableHeadSortButton`
- `TableHeadSelection`
- `TableRowSelection`
- `TagActionCell`

Even basic render tests (does it mount, does it show the right text) provide a safety net for future refactors.

---

### 21. No tests for `TagsTable` and `TagEditModal`
`tags-table.ts` and `tag-edit-modal.ts` were added recently and have no tests covering their rendering or user interactions.

---

## Accessibility

### 22. Audit interactive elements for ARIA and keyboard support
The project has no recorded accessibility audit. Per Angular best practices, all components must pass AXE checks and meet WCAG AA minimums. Focus management for modal dialogs (tag edit modal), color contrast on status badges, and keyboard navigation through tables should be verified.

---

## Minor / Nice-to-have

### 23. Use `NgOptimizedImage` for static images
Any static `<img>` tags should use Angular's `NgOptimizedImage` directive for lazy loading and intrinsic sizing hints.

### 24. Centralise logging
Multiple services use `console.log` / `console.error` directly. A thin `LoggerService` would make it easy to silence logs in production or route them to a remote sink.

### 25. Consider `PinboardItemVMStatus` as an enum
The `'unchecked' | 'checking' | 'ok' | 'maybe-stale' | 'stale'` union is used in switch branches across multiple files. Converting to a `const enum` improves exhaustiveness checking and editor autocompletion.

# Step 1 — Open Bookmark

Wire the "open bookmark" button to open `bookmark().href` in the system's default browser
using the already-installed `@tauri-apps/plugin-opener`.

---

## Files to change

### `src/app/pages/bookmark/bookmark.ts`
- Import `openUrl` from `@tauri-apps/plugin-opener`
- Add method:
  ```ts
  async openBookmark(): Promise<void> {
    await openUrl(this.bookmark().href)
  }
  ```

### `src/app/pages/bookmark/bookmark.html`
- Add `(click)="openBookmark()"` to the "open bookmark" button

### `src/app/pages/bookmark/bookmark.spec.ts`
- Mock the opener plugin at the top of the spec:
  ```ts
  vi.mock('@tauri-apps/plugin-opener', () => ({ openUrl: vi.fn() }))
  ```
- Import `openUrl` from `@tauri-apps/plugin-opener` in the spec
- Add test: `openBookmark()` calls `openUrl` with the bookmark's `href`

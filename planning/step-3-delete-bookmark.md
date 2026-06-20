# Step 3 — Delete Bookmark with Confirmation Modal

Wire the "delete" button to open an `hlm-alert-dialog` confirmation (same pattern as
tag delete in `cell-tag-action-renderer`), call `facade.deleteBookmark()`, remove the
bookmark from the local signal, then navigate back to `/bookmarks`.

---

## Files to change

### `src/app/shared/services/bookmarks/bookmarks-service.ts`
- Add method:
  ```ts
  async deleteBookmark(bookmark: BookmarkVM): Promise<void> {
    await this.facade.deleteBookmark(bookmark.href)
    this.bookmarks.update((list) => list.filter((b) => b.hash !== bookmark.hash))
  }
  ```

### `src/app/pages/bookmark/bookmark.ts`
- Inject `Router`: `readonly #router = inject(Router)`
- Add `HlmAlertDialogImports` to the component `imports` array
- Add method:
  ```ts
  async deleteBookmark(ctx: { close: () => void }): Promise<void> {
    await this.#bookmarksService.deleteBookmark(this.bookmark())
    ctx.close()
    await this.#router.navigate(['/bookmarks'])
  }
  ```

### `src/app/pages/bookmark/bookmark.html`
Replace the plain delete `<button>` with the alert-dialog pattern
(mirrors `cell-tag-action-renderer.html`):
```html
<hlm-alert-dialog>
  <button hlmBtn variant="destructive" size="sm" hlmAlertDialogTrigger>delete</button>
  <hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">
    <hlm-alert-dialog-header>
      <h2 hlmAlertDialogTitle>Delete "{{ bookmark().description }}"</h2>
      <p hlmAlertDialogDescription>
        This will permanently remove the bookmark. This action cannot be undone.
      </p>
    </hlm-alert-dialog-header>
    <hlm-alert-dialog-footer>
      <button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
      <button hlmAlertDialogAction (click)="deleteBookmark(ctx)">Delete</button>
    </hlm-alert-dialog-footer>
  </hlm-alert-dialog-content>
</hlm-alert-dialog>
```

### `src/app/shared/services/bookmarks/bookmarks-service.spec.ts`
- Add `deleteBookmark: vi.fn().mockResolvedValue(undefined)` to `mockFacade`
- Add `describe('deleteBookmark()')` tests:
  - Calls `facade.deleteBookmark` with the bookmark's `href`
  - Removes the target bookmark from the `bookmarks` signal after deletion
  - Leaves other bookmarks in the signal untouched

### `src/app/pages/bookmark/bookmark.spec.ts`
- Add `deleteBookmark: vi.fn().mockResolvedValue(undefined)` to the mock `BookmarksService`
- Add a `Router` mock to the TestBed providers: `{ provide: Router, useValue: { navigate: vi.fn() } }`
- Add test: confirming the dialog calls `bookmarksService.deleteBookmark` with the current bookmark
- Add test: after deletion, `router.navigate` is called with `['/bookmarks']`

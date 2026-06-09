# Step 2 — Single Stale Check

Wire the "stale-check" button to run a single HTTP check on the current bookmark using
the same queue + handler logic as the bulk check. The reactive `status` badge on the
page will update automatically because the existing `#handleStaleCheckStart` /
`#handleStaleCheckComplete` handlers mutate the shared `bookmarks` signal.

---

## Files to change

### `src/app/shared/services/bookmarks/bookmarks-service.ts`
- Add signal: `readonly singleStaleChecking = signal(false)`
- Add method:
  ```ts
  async checkSingleBookmark(bookmark: BookmarkVM): Promise<void> {
    try {
      this.singleStaleChecking.set(true)
      const queue = this.#staleChecker.newQueue({ concurrency: 1 })
      await this.#staleChecker.startWith(
        queue,
        [bookmark],
        this.#handleStaleCheckStart.bind(this),
        this.#handleStaleCheckComplete.bind(this)
      )
    } catch (error) {
      console.error(error)
    } finally {
      this.singleStaleChecking.set(false)
    }
  }
  ```

### `src/app/pages/bookmark/bookmark.ts`
- Add computed: `protected readonly singleStaleChecking = computed(() => this.#bookmarksService.singleStaleChecking())`
- Add method:
  ```ts
  async checkStale(): Promise<void> {
    await this.#bookmarksService.checkSingleBookmark(this.bookmark())
  }
  ```

### `src/app/pages/bookmark/bookmark.html`
- Add `(click)="checkStale()"` and `[disabled]="singleStaleChecking()"` to the stale-check button

### `src/app/shared/services/bookmarks/bookmarks-service.spec.ts`
- Add `checkSingleBookmark: vi.fn().mockResolvedValue(undefined)` to the mock shape
  where `BookmarksService` is used as a dependency in other specs
- Add `describe('checkSingleBookmark()')` tests:
  - Creates a concurrency-1 queue (assert `newQueue` called with `{ concurrency: 1 }`)
  - Calls `startWith` with only the target bookmark in the list
  - Sets `singleStaleChecking` to `true` while running, `false` after
  - Sets `singleStaleChecking` to `false` even when `startWith` throws

### `src/app/pages/bookmark/bookmark.spec.ts`
- Add `checkSingleBookmark: vi.fn().mockResolvedValue(undefined)` and
  `singleStaleChecking: signal(false)` to the mock `BookmarksService`
- Add test: the stale-check button calls `checkSingleBookmark` with the current bookmark

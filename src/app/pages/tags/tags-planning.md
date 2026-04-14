# Tags Page — Implementation Plan

## Goal
Display the user's Pinboard tags with their bookmark counts, support rename and delete, with a consistent look to the bookmarks page.

---

## 1. Service: `TagsService`
**File:** `src/app/services/tags/tags-service.ts`

- Inject `PinboardFacade`
- Signals: `tags = signal<TagVM[]>([])`, `tagsFetching = signal(false)`, `hasTags = computed(...)`
- Methods:
  - `getAllTags()` → fetches via facade (local store first), maps `PinboardTagsMap` (`Record<string, string>`) to `TagVM[]`
  - `renameTag(oldName, newName)` → calls facade → updates `tags` signal locally
  - `deleteTag(name)` → calls facade → removes tag from `tags` signal
- `TagVM`: `{ name: string; count: number }` — add to `src/app/models/`

## 2. `PinboardFacade` — fix `getAllTags` + add local-store caching
- Fix return type: `Promise<any>` → `Promise<PinboardTagsMap>`
- Add local-store caching mirroring `getAllBookmarks()`: check `'tags'` key first, only call API when empty, persist result
- Add `renameTag(oldName, newName)` → `PinboardService.renameTag()`
- Add `deleteTag(name)` → `PinboardService.deleteTag()`

## 3. Tags Page component
**Files:** `src/app/pages/tags/tags.ts` + `tags.html`

**Template structure:**
- Status/debug badge bar (same pattern as bookmarks page)
- Toolbar: "fetch tags" button (with `HlmSpinner` while loading, disabled while fetching)
- Tags table (see §4)

**Class:**
- `inject(TagsService)`
- Exposed signals mirroring bookmarks page pattern (`tags`, `tagsFetching`, `hasTags`)
- `getTags()` method

## 4. Tags Table component
**File:** `src/app/components/tags-table/tags-table.ts` + `.html`

- TanStack Angular Table (same as `BookmarksTable`)
- Columns: **Name** (sortable), **Count** (sortable), **Actions**
- Actions column: rename (pencil icon) + delete (trash icon) using `ng-icons` + `HlmButton`
- Row selection optional (can be added later)
- Accept `tags = input<TagVM[]>()`

## 5. Edit modal
**File:** `src/app/components/tags-table/tag-edit-modal/tag-edit-modal.ts` + `.html`

- Triggered by clicking a row or the edit (pencil) button
- Uses `HlmDialog` (spartan-ng)
- Shows all tag fields (current name, editable new name)
- Lists bookmarks tagged with this tag, derived from `BookmarksService` store (already loaded)
- On confirm: call `TagsService.renameTag(oldName, newName)` → `PinboardFacade` → `PinboardService.renameTag()`
- On success: update `tags` signal in `TagsService` locally

## 6. Delete interaction
- Clicking delete: call `TagsService.deleteTag(name)` → `PinboardFacade` → `PinboardService.deleteTag()`
- On success: remove tag from `tags` signal

---

## Decisions

1. **Rename UX** — clicking a row or the edit button opens a modal (large enough to hold all tag fields). The modal also shows which bookmarks are tagged with that tag.
2. **Fetch strategy** — always check local store first, mirroring the bookmarks page implementation. Only fetch from API when the store is empty.
3. **Delete confirmation** — always show a confirmation dialog (`HlmAlertDialog`) before deleting a tag, consistent with the app-wide rule of confirming all destructive actions.
4. **Tag count source** — use `PinboardTagsMap` counts directly.

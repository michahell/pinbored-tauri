# Tags Page — Implementation Plan

## Goal
Display the user's Pinboard tags with their bookmark counts, support rename and delete, with a consistent look to the bookmarks page.

---

## 1. Service: `TagsService`
**File:** `src/app/services/tags/tags-service.ts`

- Inject `PinboardFacade`
- Signals: `tags = signal<TagVM[]>([])`, `tagsFetching = signal(false)`, `hasTags = computed(...)`
- Methods: `getAllTags()` → fetches via facade, maps `PinboardTagsMap` (a `Record<string, string>`) to `TagVM[]`
- `TagVM`: `{ name: string; count: number }` — add to `src/app/models/`

## 2. `PinboardFacade` — fix `getAllTags` return type
Currently returns `Promise<any>`. Type it properly: `Promise<PinboardTagsMap>`.

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
- Accept `@Input() tags: TagVM[]`

## 5. Inline rename interaction
- Clicking rename opens an inline `<input>` in the name cell (or a small popover via `HlmPopover`)
- On confirm: call `PinboardService.renameTag()` directly from the table or via a future `TagsService.renameTag()`
- On success: update signal state locally

## 6. Delete interaction
- Clicking delete: call `TagsService.deleteTag(name)` → `PinboardFacade` → `PinboardService.deleteTag()`
- On success: remove tag from `tags` signal

---

## Open questions for refinement
1. **Rename UX** — inline input in the row vs. a popover/dialog?
2. **Fetch strategy** — always fetch fresh from API, or check local store first (like bookmarks)?
3. **Delete confirmation** — silent delete or a confirmation dialog (`HlmAlertDialog`)?
4. **Tag count source** — use `PinboardTagsMap` counts directly, or derive from already-loaded bookmarks?

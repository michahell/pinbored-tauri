---
id: TASK-003
title: 'Single bookmark page — view, edit, and delete'
status: To Do
assignee: []
created_date: '2026-06-16 12:52'
labels:
  - bookmarks
  - ui
milestone: m-0
dependencies: []
references:
  - plans/step-3-delete-bookmark.md
priority: high
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implements the single bookmark page with view, edit, and delete capabilities.\n\n### Delete flow (step-3 plan)\n\n**`bookmarks-service.ts`** — add `deleteBookmark(bookmark: BookmarkVM)`:\n```ts\nasync deleteBookmark(bookmark: BookmarkVM): Promise<void> {\n  await this.facade.deleteBookmark(bookmark.href)\n  this.bookmarks.update((list) => list.filter((b) => b.hash !== bookmark.hash))\n}\n```\n\n**`bookmark.ts`** — inject `Router`, add `HlmAlertDialogImports`, add `deleteBookmark(ctx)` method that calls the service then navigates to `/bookmarks`.\n\n**`bookmark.html`** — replace plain delete button with `hlm-alert-dialog` confirmation pattern (mirrors `cell-tag-action-renderer.html`).\n\n**`bookmarks-service.spec.ts`** — add `deleteBookmark` mock and describe block covering: calls facade with href, removes bookmark from signal, leaves others untouched.\n\n**`bookmark.spec.ts`** — add Router mock, test that confirm calls service with current bookmark, test that router navigates to `/bookmarks` after deletion.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Single bookmark page is implemented and accessible
- [ ] #2 User can edit a bookmark from the page
- [ ] #3 Delete button opens an hlm-alert-dialog confirmation modal (destructive variant)
- [ ] #4 Confirming delete calls facade.deleteBookmark, removes bookmark from store signal, and navigates to /bookmarks
- [ ] #5 Bookmark page distinguishes private and public tags visually
- [ ] #6 Unit tests cover delete service method and page component delete flow
<!-- AC:END -->

---
id: TASK-008
title: Abstract DataFacade — decouple app from Pinboard
status: To Do
assignee: []
created_date: '2026-06-16 12:53'
labels:
  - architecture
  - data
milestone: m-1
dependencies: []
priority: high
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Introduce an abstract `DataFacade` interface so the app is not tightly coupled to Pinboard.in. The existing `PinboardFacade` is renamed to `PinboardDataFacade` and a new `SqliteDataFacade` stub is created. A settings item lets users switch between data backends.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Abstract DataFacade interface is created with methods for bookmarks, tags, and notes
- [ ] #2 PinboardFacade is renamed to PinboardDataFacade and implements DataFacade
- [ ] #3 SqliteDataFacade is created and implements DataFacade
- [ ] #4 A settings item allows switching the active DataFacade between Pinboard and SQLite
- [ ] #5 App uses DataFacade exclusively — no direct references to PinboardDataFacade in pages/components
<!-- AC:END -->

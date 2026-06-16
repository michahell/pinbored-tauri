---
id: TASK-006
title: Route guard — token TTL optimization with Tauri Store
status: To Do
assignee: []
created_date: '2026-06-16 12:52'
labels:
  - auth
  - optimization
milestone: m-0
dependencies: []
priority: low
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The route guard currently performs a full auth check on every navigation. It should instead store the authentication timestamp and a `PINBOARD_TOKEN_TTL` constant in Tauri Store, and only re-authenticate when the TTL has expired.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A PINBOARD_TOKEN_TTL constant is defined
- [ ] #2 On successful auth, the timestamp is persisted in Tauri Store alongside the TTL
- [ ] #3 Route guard reads from Tauri Store and skips the API auth check if TTL has not expired
- [ ] #4 Full auth check is only triggered when the stored TTL has expired or no stored entry exists
<!-- AC:END -->

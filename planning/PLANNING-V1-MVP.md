## V1 - MVP

### tags page
- [x] implement a basic tags page
- [ ] search for tags, private/public

### single tag page
- [x] implement single tag page
- [ ] show a large tag, with a tag name, and if it is a private or public tag
- [ ] implement rename tag
- [ ] editing a single tag works (open edit tag modal again)
- [ ] implement 'show bookmarks with tag' -> filters bookmarks page
- [ ] implement delete tag

### single bookmark page
- [ ] implement single bookmark page
- [ ] editing a single bookmark works
- [ ] deleting a single bookmark works
- [ ] the bookmark page shows private and public tags differently

### bookmarks page
- [x] bookmarks page should load bookmarks initially, on init
- [x] stale checker should by default resume stale checking only unchecked bookmarks
- [x] implement persisting stale status in store as well
- [x] the bookmarks page has a separate button-bar to show all, private, public, unread, untagged and starred bookmarks
- [ ] the bookmarks page renders private and public bookmarks with a different background color
- [ ] the bookmarks page allows to filter by tag. this should be a specific tag selection filter input field.

### tags page
- [ ] fix that the delete-tag button in the delete-tag-modal does not have variant `destructive`
- [ ] the tags page has a separate button-bar to show all, used-once, common and selected tags
- [ ] the tags page has a separate button-bar on the right to select all and select none
- [ ] the tags page shows private and public tags differently

### optimizations
- [ ] the route guard should not perform an actual auth check every time, only if a new const `PINBOARD_TOKEN_TTL` has expired. until that time, it should check for a stored entry in the Tauri `Store` (together with the actual `TTL` since authentication to compare against) indicating that the user has authenticated.

### notes page
- [x] implement empty notes page, stating support is coming in V2.

### login page
- [x] login page should use a different page layout compared to pages visible after login

### various
- [ ] trial a signal-based, no dependency signal-store as opposed to NGRX / NGXS
- [ ] 
- [x] create GitHub actions pipeline


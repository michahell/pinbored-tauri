## MVP planning

### tags page
- [ ] implement a basic tags page
- [ ] search for tags, private/public

### single bookmark page
- [ ] implement single bookmark page
- [ ] editing a single bookmark works

### single tag page
- [ ] implement single tag page
- [ ] show a large green/yellow tag, with a tag name, and if it is a private or public tag
- [ ] add button rename tag
- [ ] editing a single tag works (open edit tag modal again)
- [ ] add button with title: 'show bookmarks with tag' -> filters bookmarks page
- [ ] add button delete tag

### needed optimizations
- [ ] the route guard should not perform an actual auth check every time, only if a new const `PINBOARD_TOKEN_TTL` has expired. until that time, it should check for a stored entry in the Tauri `Store` (together with the actual `TTL` since authentication to compare against) indicating that the user has authenticated.

## Enhancements

### create footer
- [ ] the footer has a lighter background in dark mode, and darker in light mode
- [ ] the footer contains some creator info, links to pinboard.in
- [ ] the footer can be hidden via settings

### bookmarks page
- [ ] the bookmarks page has a separate button-bar to show all, private, public, unread, untagged and starred bookmarks
- [ ] the bookmarks page shows private and public tags differently
- [ ] the bookmarks page renders private and public bookmarks with a different background color
- [ ] the bookmarks page allows to filter by tag. this should be a specific tag selection filter input field.

### tags page
- [ ] fix that the delete-tag button in the delete-tag-modal does not have variant `destructive`
- [ ] the tags page has a separate button-bar to show all, used-once, common and selected tags
- [ ] the tags page has a separate button-bar on the right to select all and select none
- [ ] the tags page shows private and public tags differently

### settings page
- [ ] elaborate settings page

### notes page
- [ ] implement notes page
- [ ] editing a single note works

## when there is no more work

### overview-page
- [ ] the overview page shows how much tags I have
- [ ] the overview page shows how much bookmarks I have
- [ ] the overview page shows overlap between my tags and public tags
- [ ] the overview page shows the percentage of private versus public bookmarks
- [ ] the overview page shows the percentage of private versus public tags
- [ ] the overview page shows _a local AI generated summary of my bookmark and tag collections

### settings page
- [ ] add settings for local AI via Ollama
  - [ ] settings can be turned on- or off
  - [ ] localhost URL can be filled in
  - [ ] test connection button
  - [ ] model selection dropdown

- [ ] implement arch unit TS: https://github.com/LukasNiessen/ArchUnitTS
- [ ] create GitHub actions pipeline
- [ ] add [ngx-confetti-explosion](https://github.com/ChellappanRajan/ngx-confetti-explosion?tab=readme-ov-file) (for when there are no more stale bookmarks)
- [ ] look into adding [eslint-config-angular-strict](https://github.com/Jbz797/eslint-config-angular-strict)

## has been done

- [x] update all unit-tests
- [x] implement persisting stale status in store as well
- [x] login page should use a different page layout compared to pages visible after login
- [x] bookmarks page should load bookmarks initially, on init
- [x] stale checker should by default resume stale checking only unchecked bookmarks

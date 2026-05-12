## MVP planning

### bookmarks page 

- [ ] the bookmarks page has a separate button-bar to show all, private, public, unread, untagged, starred bookmarks
- [ ] the bookmarks page shows private and public tags differently
- [ ] the bookmarks page renders private and public bookmarks with a different background color

### tags page

- [ ] implement a basic tags page
- [ ] the tags page has a separate button-bar to show all, used-once, common and selected tags
- [ ] the tags page has a separate button-bar on the right to select all and select none
- [ ] the tags page shows private and public tags differently

### single bookmark page
- [ ] implement single bookmark page

### single tag page
- [ ] implement single tag page

### notes page
- [ ] implement notes page

### settings page
- [ ] elaborate settings page

## for when all basic functionality is done

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

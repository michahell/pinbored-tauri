## V2

### main UI
- [ ] add hotkey support for back and next buttons
  - [ ] add hotkeys to settings item
  - [ ] use safari hotkeys: `meta + [` for back, and `meta + ]` for next

### Decouple from Pinboard by using abstract facades / services
- [ ] create abstract **DataFacade** with similar methods for bookmarks, tags, notes, etc.
- [ ] rename PinboardFacade to **PinboardDataFacade**
- [ ] create **SqliteDataFacade**
- [ ] create settings item where users can switch from Pinboard to **SQLite**
- [ ] settings item configures which concrete **DataFacade** gets used

### add support for using SQLite(3) as self-hosted data-store
- [ ] test using plugin-sqlite and plugin-dialog if it's possible to store and open sqlite files from iCloud storage.

### create footer
- [ ] the footer has a lighter background in dark mode, and darker in light mode
- [ ] the footer contains some creator info, links to pinboard.in
- [ ] the footer can be hidden via settings

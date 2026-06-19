import { computed, Service, Signal } from '@angular/core'
import { produce } from 'immer'
import { Immutable, ImmutableStore, useDevtools, useLogger, useStorePersistence } from 'signalstory'
import { BookmarkVM, NoteVM, TagVM } from '@data-providers/abstract'
import { Settings } from '@services/signal-store'
import { bookmarksAreEqual } from '@core/utils/bookmark-utils'

interface State {
  bookmarks: BookmarkVM[]
  tags: TagVM[]
  notes: NoteVM[]
  settings: Settings
}

const INITIAL_STATE: State = {
  bookmarks: [],
  tags: [],
  notes: [],
  settings: {
    theme: 'dark',
  },
}

@Service()
export class SignalStore extends ImmutableStore<State> {
  constructor() {
    super({
      mutationProducerFn: produce,
      initialState: INITIAL_STATE,
      plugins: [
        useDevtools(),
        useLogger(),
        useStorePersistence({
          persistenceKey: 'pinboard-signal-store-state',
          persistenceStorage: sessionStorage,
        }),
      ],
    })
  }

  // set new store data
  setBookmarks(bookmarks: BookmarkVM[]) {
    this.set({ ...this.state(), bookmarks: bookmarks }, 'setBookmarks')
  }

  setTags(tags: TagVM[]) {
    this.set({ ...this.state(), tags: tags }, 'setTags')
  }

  setNotes(notes: NoteVM[]) {
    this.set({ ...this.state(), notes: notes }, 'setNotes')
  }

  // modify store data
  mutateBookmark(bookmark: Immutable<BookmarkVM>) {
    this.mutate((state) => {
      const bookmarkToMutate: BookmarkVM = state.bookmarks.find((bookmarkInState: Immutable<BookmarkVM>) =>
        bookmarksAreEqual(bookmarkInState, bookmark)
      )!
      bookmarkToMutate.status = bookmark.status
      bookmarkToMutate.tags = bookmark.tags
      bookmarkToMutate.tagsList = [...bookmark.tagsList]
      bookmarkToMutate.hash = bookmark.hash
      bookmarkToMutate.description = bookmark.description
      bookmarkToMutate.extended = bookmark.extended
      bookmarkToMutate.meta = bookmark.meta
      bookmarkToMutate.shared = bookmark.shared
      bookmarkToMutate.time = bookmark.time
      bookmarkToMutate.toread = bookmark.toread
      bookmarkToMutate.changeHash = bookmark.changeHash
      // for (let [key, value] of Object.entries(bookmark)) {
      //   bookmarkToMutate[key] = typeof value === 'string' ? value : [value]
      // }
    }, 'updateBookmark')
  }

  mutateTag(oldName: string, newName: string): void {
    this.mutate((state) => {
      const tagToMutate: TagVM = state.tags.find((tagInState: Immutable<TagVM>) => tagInState.name === oldName)!
      tagToMutate.name = newName
    })
  }

  deleteTag(name: string): void {
    this.mutate((state) => {
      const index = state.tags.findIndex((tagInState: Immutable<TagVM>) => tagInState.name === name)!
      state.tags.splice(index, 1)
    })
  }

  // query store data
  get bookmarks(): Signal<Immutable<BookmarkVM[]>> {
    return computed(() => this.state().bookmarks)
  }

  get hasBookmarks(): Signal<Immutable<boolean>> {
    return computed(() => this.state().bookmarks?.length > 0)
  }

  get tags(): Signal<Immutable<TagVM[]>> {
    return computed(() => this.state().tags)
  }

  get hasTags(): Signal<Immutable<boolean>> {
    return computed(() => this.state().tags?.length > 0)
  }

  get notes(): Signal<Immutable<NoteVM[]>> {
    return computed(() => this.state().notes)
  }

  // Expose functions to modify the state
  // public selectUser(name: string): void {
  //   this.mutate((state) => {
  //     const userToSelect = state.find((user) => user.name === name)
  //     if (userToSelect) {
  //       userToSelect.isSelected = true
  //     }
  //   })
  // }

  // Expose functions to query the state
  // public get selectedUsers(): Signal<State> {
  //   return computed(() => this.state().filter((user) => user.isSelected))
  // }
}

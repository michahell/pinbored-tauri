import { invoke } from '@tauri-apps/api/core'
import { Component, effect, inject, model, signal } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { storage, speechSynthesis, favicon } from '@signality/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInput } from '@spartan-ng/helm/input'
import { StaleChecker } from './services/stale-checker/stale-checker'
import { StaleTable } from './components/stale-table/stale-table'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { PinboardFacade } from './services/pinboard/pinboard-facade'
import { Pinboard } from './services/pinboard/pinboard'
import {
  PinboardItemVM,
  PinboardItemVMStatus,
} from './models/pinboard-view.model'

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    HlmButtonImports,
    HlmFieldImports,
    HlmInput,
    StaleTable,
    HlmSpinner,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  bookmarks = signal<Map<string, PinboardItemVM>>(new Map())
  staleCheckedBookmarks = signal<Map<string, PinboardItemVM>>(new Map())
  bookmarksFetching = signal(false)

  readonly value = storage('key', 'Hi, Angular!') // Web Storage API
  readonly synthesis = speechSynthesis() // Web Speech API
  readonly fav = favicon() // Dynamic Favicon
  readonly #staleChecker = inject(StaleChecker)

  readonly #pinboard = inject(Pinboard)
  readonly #pinboardFacade = inject(PinboardFacade)

  readonly username = model<string | null>(null)
  readonly password = model<string | null>(null)

  constructor() {
    effect(() => {
      // update username
      const username = this.username()
      if (username != null) {
        this.#pinboard.user = username
      }
      // update password
      const password = this.password()
      if (password != null) {
        this.#pinboard.password = password
      }
      // signality
      if (this.synthesis.isSpeaking()) {
        this.fav.setEmoji('🔊')
      } else {
        this.fav.reset()
      }
    })
  }

  async getBookmarks(): Promise<void> {
    this.bookmarksFetching.set(true)
    const bookmarks: PinboardItemVM[] | void = await this.#pinboardFacade
      .getAllBookmarks()
      .catch((err) => {
        this.bookmarks.set(new Map())
        this.staleCheckedBookmarks.set(new Map())
        this.bookmarksFetching.set(false)
        console.error('ERRORED!', err)
      })

    // console.log('bookmarks returned: ', bookmarks)
    if (bookmarks && bookmarks.length > 0) {
      this.bookmarks.set(new Map(bookmarks.map((bm) => [bm.hash, bm])))
      this.staleCheckedBookmarks.set(new Map())
      this.bookmarksFetching.set(false)
    }
  }

  async staleCheck(): Promise<void> {
    try {
      await this.#staleChecker
        .newQueue()
        .startWith(this.bookmarks(), this.#handleStaleCheckerUpdate.bind(this))
    } catch (error) {
      console.error(error)
    }
  }

  #handleStaleCheckerUpdate(
    bookmark: PinboardItemVM,
    response: Response | null
  ): Promise<void> {
    // console.log('stale checker update method called for item: ', bookmark)
    // console.log('response: ', response)

    let status: PinboardItemVMStatus = 'unchecked'

    if (response == null) {
      console.info(`No Response -> invalid bookmark href -> stale`)
      status = 'stale'
    } else if (response?.ok) {
      status = 'ok'
    } else if (!response.ok) {
      console.log(`Response status: ${response.status} -> maybe-stale`)
      if (response.status === 301 || response.status === 308) {
        status = 'stale'
      } else if (response.status === 404) {
        status = 'stale'
      } else if (response.status === 401 || response.status === 403) {
        status = 'maybe-stale'
      } else if (response.status >= 500) {
        status = 'maybe-stale'
      }
    }

    // update bookmark item
    const updatedBookmark = this.#updateStaleStatus(bookmark, status)
    console.log('updated bookmark: ', updatedBookmark)

    // update lists
    const map = this.bookmarks()
    this.bookmarks.set(map.set(bookmark.hash, updatedBookmark))
    const staleMap = this.staleCheckedBookmarks()
    this.staleCheckedBookmarks.set(map.set(bookmark.hash, updatedBookmark))

    return Promise.resolve()
  }

  // async greet(event: SubmitEvent, name: string): Promise<void> {
  //   event.preventDefault()
  //
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   invoke<string>('greet', { name }).then((text) => {
  //     this.greetingMessage = text
  //   })
  // }

  #updateStaleStatus(
    bookmark: PinboardItemVM,
    status: PinboardItemVMStatus
  ): PinboardItemVM {
    return {
      ...bookmark,
      status,
    }
  }
}

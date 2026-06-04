import { inject, Injectable } from '@angular/core'
import { TauriStoreService } from '@core/tauri-store/tauri-store.service'
import { PinboardService } from '../service/pinboard-service'
import { StaleStatus } from '@services/stale-checker/stale-checker.model'
import { AbstractDataProviderFacade, BookmarkVM, TagsVM, SuggestTagsResult } from '@data-providers/abstract'
import { PinboardTagResult, PinboardUserApiToken } from '../models/pinboard.model'

@Injectable({
  providedIn: 'root',
})
export class PinboardFacade extends AbstractDataProviderFacade {
  #pinboard = inject(PinboardService)
  #localStore = inject(TauriStoreService)

  async getAllBookmarks(via: 'cache' | 'server'): Promise<BookmarkVM[]> {
    const storedBookmarks = await this.#localStore.get<BookmarkVM[]>('bookmarks')
    if (via === 'cache' && storedBookmarks != null) {
      return Promise.resolve(storedBookmarks)
    } else {
      const bookmarks = await this.#pinboard.getAllBookmarks()
      const mappedBookmarks = bookmarks.map((bookmark) => ({
        ...bookmark,
        tagsList: bookmark.tags.split(' '),
        status: 'unchecked' as StaleStatus,
      }))
      await this.#localStore.set('bookmarks', mappedBookmarks)
      return Promise.resolve(mappedBookmarks)
    }
  }

  async getAllTags(): Promise<TagsVM> {
    const storedTags = await this.#localStore.get<TagsVM>('tags')
    if (storedTags != null) {
      return Promise.resolve(storedTags)
    } else {
      const tags = await this.#pinboard.getAllTags()
      await this.#localStore.set('tags', tags)
      return Promise.resolve(tags)
    }
  }

  async renameTag(oldName: string, newName: string): Promise<PinboardTagResult> {
    return this.#pinboard.renameTag(oldName, newName)
  }

  async deleteTag(name: string): Promise<PinboardTagResult> {
    return this.#pinboard.deleteTag(name)
  }

  async deleteBookmark(url: string): Promise<void> {
    await this.#pinboard.deleteBookmark(url)
  }

  async suggestTagsForUrl(url: string): Promise<SuggestTagsResult> {
    return this.#pinboard.suggestTagsForUrl(url)
  }

  async getUserApiToken(username: string, token: string): Promise<PinboardUserApiToken> {
    return this.#pinboard.getUserApiToken(username, token)
  }
}

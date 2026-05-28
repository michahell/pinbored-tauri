import { inject, Injectable } from '@angular/core'
import { PinboardItemVM, PinboardItemVMStatus } from '@models/pinboard-view.model'
import { PinboardSuggestResult, PinboardTagResult, PinboardTagsMap, PinboardUserApiToken } from '@models/pinboard.model'
import { PinboardService } from '@core/pinboard-service/pinboard-service'
import { LocalStoreService } from '@core/store/local-store-service'

@Injectable({
  providedIn: 'root',
})
export class PinboardFacade {
  #pinboard = inject(PinboardService)
  #localStore = inject(LocalStoreService)

  async getAllBookmarks(via: 'cache' | 'server'): Promise<PinboardItemVM[]> {
    const storedBookmarks = await this.#localStore.get<PinboardItemVM[]>('bookmarks')
    if (via === 'cache' && storedBookmarks != null) {
      return Promise.resolve(storedBookmarks)
    } else {
      const bookmarks = await this.#pinboard.getAllBookmarks()
      const mappedBookmarks = bookmarks.map((bookmark) => ({
        ...bookmark,
        tagsList: bookmark.tags.split(' '),
        status: 'unchecked' as PinboardItemVMStatus,
      }))
      await this.#localStore.set('bookmarks', mappedBookmarks)
      return Promise.resolve(mappedBookmarks)
    }
  }

  async getAllTags(): Promise<PinboardTagsMap> {
    const storedTags = await this.#localStore.get<PinboardTagsMap>('tags')
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

  async suggestTagsForUrl(bookmarkUrl: string): Promise<PinboardSuggestResult> {
    return this.#pinboard.suggestTagsForUrl(bookmarkUrl)
  }

  async getUserApiToken(username: string, token: string): Promise<PinboardUserApiToken> {
    return this.#pinboard.getUserApiToken(username, token)
  }
}

import { inject, Service } from '@angular/core'
import { TauriStoreService } from '@core/tauri-store/tauri-store.service'
import { AbstractDataProviderFacade } from '@data-providers/abstract/facade/abstract-data-provider-facade'
import { PinboardService } from '@data-providers/pinboard/service/pinboard-service'
import { BookmarkVM, TagsVM, SuggestTagsResultVM } from '@data-providers/abstract/models/abstract-view.model'
import {
  PinboardTagResult,
  PinboardSuggestResult,
  PinboardUserApiToken,
} from '@data-providers/pinboard/models/pinboard.model'
import { pinboardBookmarkToBookmarkVM } from '@core/utils/bookmark-utils'

@Service()
export class PinboardFacade extends AbstractDataProviderFacade {
  #pinboard = inject(PinboardService)
  #localStore = inject(TauriStoreService)

  async getAllBookmarks(via: 'cache' | 'server'): Promise<BookmarkVM[]> {
    const storedBookmarks = await this.#localStore.get<BookmarkVM[]>('bookmarks')
    if (via === 'cache' && storedBookmarks != null) {
      return storedBookmarks
    }
    const bookmarks = await this.#pinboard.getAllBookmarks()
    const mappedBookmarks = bookmarks.map(pinboardBookmarkToBookmarkVM)
    await this.#localStore.set('bookmarks', mappedBookmarks)
    return mappedBookmarks
  }

  async getAllTags(): Promise<TagsVM> {
    const storedTags = await this.#localStore.get<TagsVM>('tags')
    if (storedTags != null) {
      return storedTags
    } else {
      const tags = await this.#pinboard.getAllTags()
      await this.#localStore.set('tags', tags)
      return tags
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

  async suggestTagsForUrl(url: string): Promise<SuggestTagsResultVM> {
    const result: PinboardSuggestResult = await this.#pinboard.suggestTagsForUrl(url)
    return { popular: result[0].popular, recommended: result[1].recommended }
  }

  async getUserApiToken(username: string, token: string): Promise<PinboardUserApiToken> {
    return this.#pinboard.getUserApiToken(username, token)
  }
}

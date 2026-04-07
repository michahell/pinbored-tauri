import { inject, Injectable } from '@angular/core'
import { PinboardService } from './pinboard-service'
import { LocalStoreService } from '../store/local-store-service'
import { PinboardItemVM, PinboardItemVMStatus } from '../../models/pinboard-view.model'

@Injectable({
  providedIn: 'root',
})
export class PinboardFacade {
  #pinboard = inject(PinboardService)
  #localStore = inject(LocalStoreService)

  async getAllBookmarks(): Promise<PinboardItemVM[]> {
    const storedBookmarks = await this.#localStore.get<PinboardItemVM[]>('bookmarks')
    if (storedBookmarks != null) {
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

  async getAllTags(): Promise<any> {
    return this.#pinboard.getAllTags()
  }

  async deleteBookmark(url: string): Promise<void> {
    await this.#pinboard.deleteBookmark(url)
  }
}

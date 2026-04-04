import { inject, Injectable } from '@angular/core'
import { Pinboard } from './pinboard'
import { PinboardItemVM } from '../../models/pinboard-view.model'

@Injectable({
  providedIn: 'root',
})
export class PinboardFacade {
  #pinboard = inject(Pinboard)

  async getAllBookmarks(): Promise<PinboardItemVM[]> {
    const bookmarks = await this.#pinboard.getAllBookmarks()
    return bookmarks.map((bookmark) => ({
      ...bookmark,
      tagsList: bookmark.tags.split(' '),
      status: 'unchecked',
    }))
  }

  async getAllTags(): Promise<any> {
    return this.#pinboard.getAllTags()
  }

  async deleteBookmark(url: string): Promise<void> {
    await this.#pinboard.deleteBookmark(url)
  }
}

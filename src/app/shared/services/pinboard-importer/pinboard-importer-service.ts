import { inject, Injectable } from '@angular/core'
import { SqliteService } from '../../data-providers/sqlite/service/sqlite-service'
import { PinboardFacade } from '../../data-providers/pinboard/facade/pinboard-facade'
import { PinboardTagsMap } from '../../data-providers/pinboard/models/pinboard.model'

interface EntityProgress {
  total: number
  current: number
}

interface PinboardImporterProgress {
  tags: EntityProgress
  notes: EntityProgress
  bookmarks: EntityProgress
}
@Injectable({
  providedIn: 'root',
})
export class PinboardImporterService {
  #pinboardFacade = inject(PinboardFacade)
  #sqliteService = inject(SqliteService)

  progress: PinboardImporterProgress = {
    tags: {
      total: 0,
      current: 0,
    },
    notes: {
      total: 0,
      current: 0,
    },
    bookmarks: {
      total: 0,
      current: 0,
    },
  }

  #importTagQuery =
    'INSERT INTO tags (id, name, count) VALUES ($1, $2, $3) ON CONFLICT(name) DO UPDATE SET name  = excluded.name, count=excluded.count;'

  async import(): Promise<void> {
    await this.#importTags()
    // await this.#importNotes()
    // await this.#importBookmarks()
  }

  async #importTags(): Promise<void> {
    const tags: PinboardTagsMap = await this.#pinboardFacade.getAllTags()
    this.progress.tags.total = Object.keys(tags).length
    this.progress.tags.current = 1
    for (const [tag, count] of Object.entries(tags)) {
      await this.#sqliteService.execute(this.#importTagQuery, [tag, count])
      this.progress.tags.current++
    }
  }

  // async #importNotes(): Promise<void> {}

  // async #importBookmarks(): Promise<void> {}
}

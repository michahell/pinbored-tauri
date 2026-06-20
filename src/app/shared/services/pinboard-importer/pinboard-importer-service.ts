import { inject, Service } from '@angular/core'
import { PinboardTagsMap } from '@data-providers/pinboard/models/pinboard.model'
import { PinboardFacade } from '@data-providers/pinboard/facade/pinboard-facade'
import { SqliteInterface } from '@core/sqlite-interface/sqlite-interface'

interface EntityProgress {
  total: number
  current: number
}

interface PinboardImporterProgress {
  tags: EntityProgress
  notes: EntityProgress
  bookmarks: EntityProgress
}
@Service()
export class PinboardImporterService {
  #pinboardFacade = inject(PinboardFacade)
  #sqliteInterface = inject(SqliteInterface)

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

  #selectCountsQuery = 'SELECT COUNT(hash) FROM bookmarks AS bookmarkCount'

  async import(): Promise<void> {
    await this.#importTags()
    // await this.#importNotes()
    // await this.#importBookmarks()
    await this.#reportImported()
  }

  async #importTags(): Promise<void> {
    const tags: PinboardTagsMap = await this.#pinboardFacade.getAllTags()
    this.progress.tags.total = Object.keys(tags).length
    this.progress.tags.current = 1
    for (const [tag, count] of Object.entries(tags)) {
      await this.#sqliteInterface.execute(this.#importTagQuery, [tag, count])
      this.progress.tags.current++
    }
  }

  // async #importNotes(): Promise<void> {}

  // async #importBookmarks(): Promise<void> {}

  async #reportImported(): Promise<string | null> {
    return await this.#sqliteInterface.select(this.#selectCountsQuery)
  }
}

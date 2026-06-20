import { inject, Service } from '@angular/core'
import { TagsVM } from '@data-providers/abstract/models/abstract-view.model'
import { SqliteInterface } from '@core/sqlite-interface/sqlite-interface'

@Service()
export class SqliteService {
  readonly #sqliteInterface = inject(SqliteInterface)

  async getTags(): Promise<TagsVM | null> {
    if (!this.#sqliteInterface.hasOpenDatabase()) {
      return null
    }
    const result = await this.#sqliteInterface.select<TagsVM>('SELECT * from tags')
    console.log('getTags() database.select result: ', result)
    return result
  }
}

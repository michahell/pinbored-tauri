import { Injectable } from '@angular/core'
import { open, save } from '@tauri-apps/plugin-dialog'
import { homeDir } from '@tauri-apps/api/path'
import { create, BaseDirectory } from '@tauri-apps/plugin-fs'
import Database, { QueryResult } from '@tauri-apps/plugin-sql'
import { ICLOUD_DEFAULT_DIRECTORY_NAME } from '@core/constants/app-constants'
import { PinboardTagsMap } from '@models/pinboard.model'

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  #database: Database | null = null

  async #getDefaultDir(): Promise<string> {
    //resolves to:
    //    '/Users/michaeltrouw/Library/Mobile Documents/com~apple~CloudDocs/Pinbored'
    return `${await homeDir()}/Library/Mobile Documents/com~apple~CloudDocs/${ICLOUD_DEFAULT_DIRECTORY_NAME}`
  }

  async selectFile(): Promise<string | null> {
    const file = await open({
      multiple: false,
      directory: false,
      defaultPath: await this.#getDefaultDir(),
    })
    console.log('chosen file path: ', file)
    return file
  }
  async openAndLoadDatabase(): Promise<void> {
    const file = await this.selectFile()
    console.log('opening database: ', file)
    this.#database = await Database.load(`sqlite:pinbored.db`) //${file}
    console.log('opened database:', this.#database, 'path: ', this.#database.path)
  }

  async createDatabase(): Promise<string | null> {
    const path = await save({
      title: 'create new pinbored sqlite database',
      defaultPath: await this.#getDefaultDir(),
      filters: [
        {
          name: 'pinbored',
          extensions: ['db'],
        },
      ],
    })
    console.log('create new pinbored sqlite database using path: ', path)
    if (path) {
      const file = await create(path, { baseDir: BaseDirectory.Home })
      console.log('created file, fileHandle: ', file)
      await file.close()
      console.log('...closed file again')
      return path
    } else {
      return null
    }
  }

  async getTags(): Promise<PinboardTagsMap | null> {
    if (!this.#database) {
      return null
    }
    const result = await this.#database.select<PinboardTagsMap>('SELECT * from tags')
    console.log('getTags() database.select result: ', result)
    return result
  }

  async execute(query: string, bindValues: unknown[]): Promise<QueryResult | null> {
    if (!this.#database) {
      return null
    }
    const result = await this.#database.execute(query, bindValues)
    console.log('execute() database.execute result: ', result)
    return result
  }

  async close(): Promise<boolean> {
    return this.#database ? this.#database.close() : false
  }
}

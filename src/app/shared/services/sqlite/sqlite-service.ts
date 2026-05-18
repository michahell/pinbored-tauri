import { Injectable } from '@angular/core'
import { open, save } from '@tauri-apps/plugin-dialog'
import { homeDir } from '@tauri-apps/api/path'
import { create, BaseDirectory } from '@tauri-apps/plugin-fs'
import Database from '@tauri-apps/plugin-sql'
import { ICLOUD_DEFAULT_DIRECTORY_NAME } from '@core/app-constants'

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  #database: Database | null = null

  async #getDefaultDir(): Promise<string> {
    return `${await homeDir()}/Library/Mobile\ Documents/com\~apple\~CloudDocs/${ICLOUD_DEFAULT_DIRECTORY_NAME}`
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
    this.#database = await Database.load(`sqlite:${file}`)
    console.log('opened database with path:', this.#database.path)
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
    console.log(path)
    if (path) {
      const file = await create(path, { baseDir: BaseDirectory.Home })
      await file.write(new TextEncoder().encode('Hello world'))
      await file.close()
      return path
    } else {
      return null
    }
  }

  async close(): Promise<boolean> {
    return this.#database ? this.#database.close() : false
  }
}

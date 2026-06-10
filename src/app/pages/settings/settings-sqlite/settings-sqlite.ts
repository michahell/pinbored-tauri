import { Component, inject, signal } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmButton } from '@spartan-ng/helm/button'
import { NgIcon } from '@ng-icons/core'
import { ACTION_DEBOUNCE_TIME } from '@core/constants/app-constants'
import { SqliteInterface } from '@core/sqlite-interface/sqlite-interface'
import { PinboardImporterService } from '@services/pinboard-importer/pinboard-importer-service'

@Component({
  selector: 'app-settings-sqlite',
  imports: [HlmButton, HlmCardImports, HlmInputGroupImports, NgIcon],
  templateUrl: './settings-sqlite.html',
})
export default class SettingsSqlite {
  #sqliteInterface = inject(SqliteInterface)
  #importService = inject(PinboardImporterService)

  dbPathCleared = signal(false)

  async createDb(): Promise<void> {
    await this.#sqliteInterface.createDatabase()
  }

  async selectDb(): Promise<void> {
    await this.#sqliteInterface.openAndLoadDatabase()
  }

  async testDb(): Promise<void> {
    await this.#sqliteInterface.testConnection()
  }

  async importPinboard(): Promise<void> {
    await this.#importService.import()
  }

  async clearSelectedDb(): Promise<void> {
    await this.#sqliteInterface.close()
    this.dbPathCleared.set(true)
    console.log('closed database connection')
    setTimeout(() => {
      this.dbPathCleared.set(false)
      console.log('reset dbPathCleared() signal')
    }, ACTION_DEBOUNCE_TIME)
  }
}

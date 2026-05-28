import { Component, inject, signal } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmButtonGroup } from '@spartan-ng/helm/button-group'
import { NgIcon } from '@ng-icons/core'
import { SqliteService } from '@services/sqlite/sqlite-service'
import { ACTION_DEBOUNCE_TIME } from '../../../shared/core/constants/app-constants'

@Component({
  selector: 'app-settings-sqlite',
  imports: [HlmButton, HlmButtonGroup, HlmCardImports, NgIcon, HlmInputGroupImports],
  templateUrl: './settings-sqlite.html',
})
export default class SettingsSqlite {
  #sqliteService = inject(SqliteService)

  dbPathCleared = signal(false)

  async createDb(): Promise<void> {
    await this.#sqliteService.createDatabase()
  }

  async selectDb(): Promise<void> {
    await this.#sqliteService.openAndLoadDatabase()
  }

  async clearSelectedDb(): Promise<void> {
    await this.#sqliteService.close()
    this.dbPathCleared.set(true)
    setTimeout(() => {
      console.log('resetting dbPathCleared...')
      this.dbPathCleared.set(false)
    }, ACTION_DEBOUNCE_TIME)
  }
}

import { Component, inject, signal } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmButtonGroup } from '@spartan-ng/helm/button-group'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { ACTION_DEBOUNCE_TIME } from '@core/constants/app-constants'
import { TauriStoreService } from '@core/tauri-store/tauri-store.service'

@Component({
  selector: 'app-settings-caching',
  imports: [HlmCardImports, HlmButton, HlmButtonGroup, HlmSpinner, NgIcon],
  templateUrl: './settings-caching.html',
})
export default class SettingsCaching {
  #store = inject(TauriStoreService)

  clearingStore = signal(false)
  storeCleared = signal(false)

  async clearStore(): Promise<void> {
    this.clearingStore.set(true)
    await this.#store.clear()
    this.storeCleared.set(true)
    setTimeout(() => {
      this.storeCleared.set(false)
      this.clearingStore.set(false)
    }, ACTION_DEBOUNCE_TIME)
  }
}

import { Component, inject, signal } from '@angular/core'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmButtonGroup } from '@spartan-ng/helm/button-group'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { ACTION_DEBOUNCE_TIME } from '@constants/app-constants'
import { LocalStoreService } from '@services/store/local-store-service'
import { NgIcon } from '@ng-icons/core'

@Component({
  selector: 'app-settings-caching',
  imports: [HlmCardImports, HlmButton, HlmButtonGroup, HlmSpinner, NgIcon],
  templateUrl: './settings-caching.html',
})
export default class SettingsCaching {
  #store = inject(LocalStoreService)

  clearingStore = signal(false)
  storeCleared = signal(false)

  async clearStore(): Promise<void> {
    this.clearingStore.set(true)
    console.log('clearing store...')
    await this.#store.clear()
    this.storeCleared.set(true)
    setTimeout(() => {
      console.log('resetting storeCleared...')
      this.storeCleared.set(false)
      this.clearingStore.set(false)
    }, ACTION_DEBOUNCE_TIME)
  }
}

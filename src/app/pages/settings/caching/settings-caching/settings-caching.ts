import { Component, inject, signal } from '@angular/core'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmButtonGroup } from '@spartan-ng/helm/button-group'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmSpinner } from '@spartan-ng/helm/spinner'
import { ACTION_DEBOUNCE_TIME } from '@constants/app-constants'
import { LocalStoreService } from '@services/store/local-store-service'

@Component({
  selector: 'app-settings-caching',
  imports: [HlmCardImports, HlmButton, HlmButtonGroup, HlmSpinner],
  templateUrl: './settings-caching.html',
})
export default class SettingsCaching {
  #store = inject(LocalStoreService)

  storeCleared = signal(false)
  clearingStore = signal(false)

  async clearStore(): Promise<void> {
    this.clearingStore.set(true)
    console.log('clearing store...')
    await this.#store.clear()
    setTimeout(() => {
      console.log('resetting storeCleared...')
      this.storeCleared.set(false)
      this.clearingStore.set(false)
    }, ACTION_DEBOUNCE_TIME)
  }
}

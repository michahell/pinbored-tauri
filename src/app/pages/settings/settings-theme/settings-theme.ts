import { Component, inject } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmButtonGroup } from '@spartan-ng/helm/button-group'
import { SettingsService } from '../settings-service'
import { type Theme } from '@services/signal-store'

@Component({
  selector: 'app-settings-theme',
  imports: [HlmCardImports, HlmButton, HlmButtonGroup],
  templateUrl: './settings-theme.html',
})
export default class SettingsTheme {
  #settings = inject(SettingsService)

  setTheme(type: Theme): void {
    this.#settings.setTheme(type)
  }
}

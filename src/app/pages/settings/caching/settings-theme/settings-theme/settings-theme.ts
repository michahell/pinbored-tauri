import { Component, inject } from '@angular/core'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmButtonGroup } from '@spartan-ng/helm/button-group'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { SettingsService } from '../../../settings-service'
import { Theme } from '@models/settings-model'

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

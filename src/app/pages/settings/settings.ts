import { Component, inject } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { hlmH4 } from '@spartan-ng/helm/typography'
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group'
import { MainLayout } from '../../layouts/main-layout/main-layout'
import { SettingsService } from '../../services/settings/settings-service'
import { Theme } from '../../services/settings/settings-model'

@Component({
  selector: 'app-settings',
  imports: [HlmCardImports, HlmButtonImports, HlmButtonGroupImports, MainLayout],
  templateUrl: './settings.html',
})
export default class Settings {
  hlmH4 = hlmH4

  #settings = inject(SettingsService)

  setTheme(type: Theme): void {
    this.#settings.setTheme(type)
  }
}

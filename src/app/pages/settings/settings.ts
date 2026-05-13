import { Component } from '@angular/core'
import { MainLayout } from '../../shared/components/layouts/main-layout/main-layout'
import { hlmH4 } from '@spartan-ng/helm/typography'
import SettingsCaching from './caching/settings-caching/settings-caching'
import SettingsTheme from './caching/settings-theme/settings-theme/settings-theme'

@Component({
  selector: 'app-settings',
  imports: [MainLayout, SettingsCaching, SettingsTheme],
  templateUrl: './settings.html',
})
export default class Settings {
  hlmH4 = hlmH4
}

import { Component } from '@angular/core'
import { hlmH4 } from '@spartan-ng/helm/typography'
import { MainLayout } from '@components/layouts/main-layout/main-layout'
import SettingsCaching from './settings-caching/settings-caching'
import SettingsTheme from './settings-theme/settings-theme'
import SettingsSqlite from './settings-sqlite/settings-sqlite'

@Component({
  selector: 'app-settings',
  imports: [MainLayout, SettingsCaching, SettingsTheme, SettingsSqlite],
  templateUrl: './settings.html',
})
export default class Settings {
  hlmH4 = hlmH4
}

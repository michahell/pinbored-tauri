import { Component, effect, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SettingsService } from './pages/settings/settings-service'
import { NgxLoadingBar } from '@ngx-loading-bar/core'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxLoadingBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly #settingsService = inject(SettingsService)

  // Runs once. automatically change theme based on the system theme.
  #changeThemeOnceEffect = effect(() => {
    const preference = this.#settingsService.systemColorschemePreference()
    this.#settingsService.setTheme(preference)
    this.#changeThemeOnceEffect.destroy()
  })
}

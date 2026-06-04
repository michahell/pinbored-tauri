import { Component, effect, inject, ChangeDetectionStrategy } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { storage } from '@signality/core'
import { SettingsService } from './pages/settings/settings-service'
import { NgxLoadingBar } from '@ngx-loading-bar/core'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxLoadingBar],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  readonly #settingsService = inject(SettingsService)

  readonly value = storage('key', 'Hi, Angular!') // Web Storage API

  // Runs once. automatically change theme based on user's system theme.
  #changeThemeOnceEffect = effect(() => {
    const preference = this.#settingsService.systemColorschemePreference()
    this.#settingsService.setTheme(preference)
    this.#changeThemeOnceEffect.destroy()
  })
}

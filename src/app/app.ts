import { Component, effect, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { storage } from '@signality/core'
import { invoke } from '@tauri-apps/api/core'
import { Menu } from './components/menu/menu'
import { SettingsService } from './services/settings/settings-service'
import { Breadcrumbs } from './components/breadcrumbs/breadcrumbs'
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, Menu, Breadcrumbs, HlmProgress, HlmProgressIndicator],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly #settingsService = inject(SettingsService)

  readonly value = storage('key', 'Hi, Angular!') // Web Storage API

  constructor() {
    // RUN ALWAYS
    effect(() => {})

    // RUN ONCE
    const effectRef = effect(() => {
      // automatically change theme based on user's system theme
      const preference = this.#settingsService.colorschemePreference()
      this.#settingsService.setTheme(preference)
      effectRef.destroy()
    })
  }

  async greet(event: SubmitEvent, name: string): Promise<void> {
    event.preventDefault()

    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    invoke<string>('greet', { name }).then((text) => {
      // this.greetingMessage = text
    })
  }
}

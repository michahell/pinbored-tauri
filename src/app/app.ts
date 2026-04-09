import { Component, effect, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { storage } from '@signality/core'
import { invoke } from '@tauri-apps/api/core'
import { SettingsService } from './services/settings/settings-service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly #settingsService = inject(SettingsService)

  readonly value = storage('key', 'Hi, Angular!') // Web Storage API

  constructor() {
    // RUN ALWAYS
    // effect(() => {})

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

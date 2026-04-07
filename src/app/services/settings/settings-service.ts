import { computed, Injectable, Signal } from '@angular/core'
import { mediaQuery } from '@signality/core'
import { Theme } from './settings-model'

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  readonly prefersDark = mediaQuery('(prefers-color-scheme: dark)')
  readonly prefersLight = mediaQuery('(prefers-color-scheme: light)')
  readonly colorschemePreference: Signal<Theme> = computed(() =>
    this.prefersDark() ? 'dark' : this.prefersLight() ? 'light' : 'system'
  )

  setTheme(theme: Theme): void {
    if (theme === 'dark') {
      this.#setDarkTheme()
    } else if (theme === 'light') {
      this.#setLightTheme()
    } else if (theme === 'system') {
      this.colorschemePreference() === 'dark' ? this.#setDarkTheme() : this.#setLightTheme()
    }
  }

  #setDarkTheme(): void {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
    // localStorage.setItem('theme', 'dark')
  }

  #setLightTheme(): void {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    // localStorage.setItem('theme', 'light')
  }
}

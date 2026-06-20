import { computed, Service, Signal } from '@angular/core'
import { mediaQuery } from '@signality/core'
import { Theme } from '../../shared/core/models/settings-model'

@Service()
export class SettingsService {
  readonly prefersDark = mediaQuery('(prefers-color-scheme: dark)')
  readonly prefersLight = mediaQuery('(prefers-color-scheme: light)')
  readonly systemColorschemePreference: Signal<Theme> = computed(() =>
    this.prefersDark() ? 'dark' : this.prefersLight() ? 'light' : 'system'
  )

  setTheme(theme: Theme): void {
    if (theme === 'dark') {
      this.#setDarkTheme()
    } else if (theme === 'light') {
      this.#setLightTheme()
    } else if (theme === 'system') {
      if (this.systemColorschemePreference() === 'dark') {
        this.#setDarkTheme()
      } else {
        this.#setLightTheme()
      }
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

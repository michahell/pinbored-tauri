import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { LocalStore } from './services/store/local-store'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(async () => {
      const localStore = inject(LocalStore)
      await localStore.load()
    }),
  ],
}

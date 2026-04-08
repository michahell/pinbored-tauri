import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { LocalStoreService } from './services/store/local-store-service'
import { provideAllIcons } from './utils/provide-all-icons'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAllIcons,
    provideAppInitializer(async () => {
      const localStore = inject(LocalStoreService)
      await localStore.load()
    }),
  ],
}

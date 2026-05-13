import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { provideAllIcons } from './shared/core/provide-all-icons'
import { provideLoadingBar } from '@ngx-loading-bar/core'
import { provideLoadingBarRouter } from '@ngx-loading-bar/router'
import { LocalStoreService } from './shared/core/store/local-store-service'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAllIcons,
    // ngx-progress-loader (for router)
    provideLoadingBar({ latencyThreshold: 10 }),
    provideLoadingBarRouter(),
    // custom initializer logic
    provideAppInitializer(async () => {
      const localStore = inject(LocalStoreService)
      await localStore.load()
    }),
  ],
}

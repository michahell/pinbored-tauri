import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { provideLoadingBar } from '@ngx-loading-bar/core'
import { provideLoadingBarRouter } from '@ngx-loading-bar/router'
import { provideAllIcons } from '@core/utils/provide-all-icons'
import { TauriStoreService } from '@core/tauri-store/tauri-store.service'

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
      const localStore = inject(TauriStoreService)
      await localStore.load()
    }),
  ],
}

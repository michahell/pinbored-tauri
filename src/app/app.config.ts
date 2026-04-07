import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { LocalStoreService } from './services/store/local-store-service'
import { provideIcons } from '@ng-icons/core'
import {
  lucideArrowLeft,
  lucideArrowUpDown,
  lucideChevronDown,
  lucideChevronRight,
  lucideEllipsis,
} from '@ng-icons/lucide'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIcons({
      lucideEllipsis,
      lucideChevronDown,
      lucideChevronRight,
      lucideArrowLeft,
      lucideArrowUpDown,
    }),
    provideAppInitializer(async () => {
      const localStore = inject(LocalStoreService)
      await localStore.load()
    }),
  ],
}

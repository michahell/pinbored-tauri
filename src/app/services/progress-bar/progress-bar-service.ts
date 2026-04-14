import { inject, Injectable } from '@angular/core'
import { LoadingBarService } from '@ngx-loading-bar/core'

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  #loadingBarService = inject(LoadingBarService)

  start(initialNumber?: number): void {
    this.#loadingBarService.useRef().start(initialNumber)
  }

  stop(): void {
    this.#loadingBarService.useRef().stop()
  }

  complete(): void {
    this.#loadingBarService.useRef().complete()
  }

  disable(): void {
    this.#loadingBarService.useRef().disable()
  }

  increment(value?: number): void {
    this.#loadingBarService.useRef().increment(value)
  }
}

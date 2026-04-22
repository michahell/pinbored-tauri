import { inject, Injectable } from '@angular/core'
import { LoadingBarService } from '@ngx-loading-bar/core'

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {
  #loadingBarService = inject(LoadingBarService)

  start(id: string, initialNumber?: number): void {
    this.#loadingBarService.useRef(id).start(initialNumber)
  }

  stop(id: string): void {
    this.#loadingBarService.useRef(id).stop()
  }

  complete(id: string): void {
    this.#loadingBarService.useRef(id).complete()
  }

  disable(id: string): void {
    this.#loadingBarService.useRef(id).disable()
  }

  increment(id: string, value?: number): void {
    this.#loadingBarService.useRef(id).increment(value)
  }
}

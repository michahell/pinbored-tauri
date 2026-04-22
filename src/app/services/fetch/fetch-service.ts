import { inject, Injectable } from '@angular/core'
import { fetch } from '@tauri-apps/plugin-http'
import { ProgressBarService } from '../progress-bar/progress-bar-service'

@Injectable({
  providedIn: 'root',
})
export class FetchService {
  #progressBarService = inject(ProgressBarService)
  /**
   * this only exists to wrap around tauri's fetch() to always do certain things.
   * basically, a fetch interceptor... that we can't build because angular/http is not used :(
   * @param input
   * @param init
   */
  fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    return new Promise((resolve, reject) => {
      this.#progressBarService.start('topProgress')
      fetch(input, init)
        .then((response) => {
          this.#progressBarService.complete('topProgress')
          return response
        })
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          this.#progressBarService.stop('topProgress')
          reject(err)
        })
    })
  }
}

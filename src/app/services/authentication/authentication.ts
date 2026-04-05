import { inject, Injectable, signal } from '@angular/core'
import { LocalStore } from '../store/local-store'
import { Pinboard } from '../pinboard/pinboard'

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  readonly #pinboard = inject(Pinboard)
  readonly #localStore = inject(LocalStore)

  readonly authStatus = signal<
    'checking' | 'unauthenticated' | 'authenticated'
  >('checking')

  async checkAuthentication(): Promise<void> {
    try {
      const username = await this.#localStore.get<string>('username')
      const password = await this.#localStore.get<string>('password')
      if (username && password) {
        console.info(
          `user was authenticated earlier with: ${username} / ${password}`
        )
        this.setAuthenticated(username, password, true, true)
      } else {
        this.setUnauthenticated()
        console.info('user not authenticated!')
        this.authStatus.set('unauthenticated')
      }
    } catch (error) {
      console.log(error)
      this.authStatus.set('unauthenticated')
    }
  }

  setAuthenticated(
    username: string | null = null,
    password: string | null = null,
    saveToStore: boolean = false,
    saveToPinboardService: boolean = false
  ) {
    if (saveToStore && username != null && password != null) {
      // store username & password in localStorage
      this.#localStore.set('username', username)
      this.#localStore.set('password', password)
    }
    if (saveToPinboardService && username != null && password != null) {
      this.#pinboard.user = username
      this.#pinboard.password = password
    }
    console.info(
      'authenticated with: ',
      this.#pinboard.user,
      ' / ',
      this.#pinboard.password
    )
    this.authStatus.set('authenticated')
  }

  setUnauthenticated() {
    // remove stored username & password in Pinboard service
    this.#pinboard.user = ''
    this.#pinboard.password = ''
  }
}

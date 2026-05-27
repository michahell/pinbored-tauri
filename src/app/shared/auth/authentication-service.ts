import { inject, Injectable, signal } from '@angular/core'
import { LocalStoreService } from '../core/store/local-store-service'
import { PinboardService } from '../core/pinboard/pinboard-service'

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  readonly #pinboard = inject(PinboardService)
  readonly #localStore = inject(LocalStoreService)

  readonly authStatus = signal<'checking' | 'unauthenticated' | 'authenticated'>('checking')

  async authenticate(withInput: { username: string; token: string } | null = null): Promise<boolean> {
    // try to fetch stored auth from local storage
    const [storedUsername, storedToken] = await Promise.all([
      this.#localStore.get<string>('username'),
      this.#localStore.get<string>('token'),
    ])

    // neither stored nor input given, auth failed
    if ((!storedUsername || !storedToken) && (!withInput?.username || !withInput?.token)) {
      return this.#setUnauthenticated()
      // return Promise.reject('no stored auth found nor input auth provided -> failed to authenticate.')
    }

    // try to authenticate from stored auth when none given, first
    if (storedUsername && storedToken) {
      return this.#doAuthenticate(storedUsername, storedToken)
    }
    // try to authenticate from input auth, when provided
    else if (withInput?.username && withInput?.token) {
      return this.#doAuthenticate(withInput.username, withInput.token)
    }
    return this.#setUnauthenticated()
  }

  async #doAuthenticate(username: string, token: string): Promise<boolean> {
    const apiToken = await this.#pinboard.getUserApiToken(username, token)
    if (apiToken != null) {
      return this.#setAuthenticated(username, token, true, true)
    } else {
      return this.#setUnauthenticated()
    }
  }

  #setAuthenticated(
    username: string | null = null,
    token: string | null = null,
    saveToStore = false,
    saveToPinboardService = false
  ): boolean {
    if (username == null || token == null) {
      throw new Error('username or token is null')
    }
    if (saveToStore) {
      // store username & token in localStorage
      this.#localStore.set('username', username)
      this.#localStore.set('token', token)
    }
    if (saveToPinboardService) {
      this.#pinboard.storedUsername = username
      this.#pinboard.storedToken = token
    }
    this.authStatus.set('authenticated')
    console.info('authenticated with: ', this.#pinboard.storedUsername, ' / ', this.#pinboard.storedToken)
    return true
  }

  #setUnauthenticated(): boolean {
    // remove stored username & token in Pinboard service
    this.#pinboard.storedUsername = ''
    this.#pinboard.storedToken = ''
    this.authStatus.set('unauthenticated')
    console.info('user not authenticated!')
    return false
  }

  async logout(): Promise<void> {
    await this.#localStore.set('username', null)
    await this.#localStore.set('token', null)
    return
  }
}

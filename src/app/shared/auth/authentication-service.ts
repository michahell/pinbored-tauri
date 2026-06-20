import { inject, Service, signal } from '@angular/core'
import { PinboardService } from '@data-providers/pinboard/service/pinboard-service'
import { PinboardFacade } from '@data-providers/pinboard/facade/pinboard-facade'
import { SignalStore } from '@services/signal-store/signal-store'

@Service()
export class AuthenticationService {
  readonly #facade = inject(PinboardFacade)
  readonly #pinboard = inject(PinboardService)
  readonly #signalStore = inject(SignalStore)

  readonly authStatus = signal<'checking' | 'unauthenticated' | 'authenticated'>('checking')

  async authenticate(withInput: { username: string; token: string } | null = null): Promise<boolean> {
    // try to fetch stored auth from signal store (possible due to local-storage persistence)
    const { storedUsername, storedToken } = this.#signalStore.auth() ?? { storedUsername: null, storedToken: null }

    // neither stored nor input given, auth failed
    if ((!storedUsername || !storedToken) && (!withInput?.username || !withInput?.token)) {
      return this.#setUnauthenticated()
    }

    // try to authenticate from input auth, when provided
    else if (withInput?.username && withInput?.token) {
      return this.#doAuthenticate(withInput.username, withInput.token)
    }

    // try to authenticate from stored auth when no input was given
    else if (storedUsername && storedToken) {
      return this.#doAuthenticate(storedUsername, storedToken)
    }

    return this.#setUnauthenticated()
  }

  async #doAuthenticate(username: string, token: string): Promise<boolean> {
    try {
      const apiToken = await this.#facade.getUserApiToken(username, token)
      if (apiToken != null) {
        return this.#setAuthenticated(username, token, true, true)
      } else {
        return this.#setUnauthenticated()
      }
    } catch (error) {
      console.log(error)
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
    // store username & token in signal store
    if (saveToStore) {
      this.#signalStore.setAuth(username, token)
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

  logout(): void {
    this.#signalStore.deleteAuth()
  }
}

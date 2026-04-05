import { Component, inject, OnInit, signal } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner'
import { Pinboard } from '../../services/pinboard/pinboard'
import { Router } from '@angular/router'
import { LocalStore } from '../../services/store/local-store'

interface PinboardLoginForm {
  username: FormControl<string | null>
  password: FormControl<string | null>
}

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HlmButton,
    HlmSpinnerImports,
    HlmCardImports,
    HlmFieldImports,
    HlmInputImports,
  ],
  templateUrl: './login.html',
})
export default class Login implements OnInit {
  readonly #pinboard = inject(Pinboard)
  readonly #localStore = inject(LocalStore)
  readonly #router = inject(Router)

  readonly loginForm = new FormGroup<PinboardLoginForm>({
    username: new FormControl('', {}),
    password: new FormControl('', {}),
  })

  readonly authStatus = signal<
    'checking' | 'unauthenticated' | 'authenticated'
  >('checking')

  async ngOnInit(): Promise<void> {
    try {
      const username = await this.#localStore.get('username')
      const password = await this.#localStore.get('password')
      if (username && password) {
        this.authenticated()
      } else {
        this.authStatus.set('unauthenticated')
      }
    } catch (error) {
      console.log(error)
      this.authStatus.set('unauthenticated')
    }
  }

  async login(): Promise<void> {
    const username = this.loginForm.controls.username.value
    const password = this.loginForm.controls.password.value

    if (username != null && password != null) {
      // update username & password
      this.#pinboard.user = username
      this.#pinboard.password = password
      // make a request to see if auth is correct
      try {
        const apiToken = await this.#pinboard.getUserApiToken()
        apiToken != null ? this.authenticated(true) : this.#unauthenticated()
      } catch (error: any) {
        this.#unauthenticated()
      }
    } else {
      this.loginForm.setErrors({ unauthenticated: { something: 'wrong' } })
    }
  }

  authenticated(store: boolean = false) {
    if (store) {
      // store username & password in localStorage
      this.#localStore.set('username', this.#pinboard.user)
      this.#localStore.set('password', this.#pinboard.password)
    }
    this.authStatus.set('authenticated')
    this.#router.navigate(['/bookmarks'])
  }

  #unauthenticated() {
    this.loginForm.setErrors({ unauthenticated: { something: 'wrong' } })
    // remove stored username & password in Pinboard service
    this.#pinboard.user = ''
    this.#pinboard.password = ''
  }
}

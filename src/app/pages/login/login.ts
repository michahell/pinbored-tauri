import { Component, inject, OnInit } from '@angular/core'
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
import { Authentication } from '../../services/authentication/authentication'

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
  readonly #authenticationService = inject(Authentication)
  readonly #pinboard = inject(Pinboard)
  readonly #router = inject(Router)

  readonly loginForm = new FormGroup<PinboardLoginForm>({
    username: new FormControl('', {}),
    password: new FormControl('', {}),
  })

  readonly authStatus = this.#authenticationService.authStatus

  async ngOnInit(): Promise<void> {
    console.log('Login page initialized, checking authentication...')
    await this.#authenticationService.checkAuthentication()
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
        if (apiToken != null) {
          this.#authenticationService.setAuthenticated(username, password, true)
          this.#router.navigate(['/bookmarks']).then(() => {})
        } else {
          this.#unauthenticated()
        }
      } catch (error: any) {
        this.#unauthenticated()
      }
    } else {
      this.loginForm.setErrors({ unauthenticated: { something: 'wrong' } })
    }
  }

  #unauthenticated() {
    this.loginForm.setErrors({ unauthenticated: { something: 'wrong' } })
    this.#authenticationService.setUnauthenticated()
  }
}

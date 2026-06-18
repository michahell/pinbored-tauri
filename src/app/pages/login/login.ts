import { Component, computed, effect, inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmFieldImports } from '@spartan-ng/helm/field'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner'
import { Router } from '@angular/router'
import { AuthenticationService } from '@auth/authentication-service'
import { LANDING_ROUTE_AFTER_LOGIN } from '@core/constants/app-constants'

interface PinboardLoginForm {
  username: FormControl<string | null>
  token: FormControl<string | null>
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
  readonly #authenticationService = inject(AuthenticationService)
  readonly #router = inject(Router)

  readonly loginForm = new FormGroup<PinboardLoginForm>({
    username: new FormControl('', {}),
    token: new FormControl('', {}),
  })

  readonly authStatus = computed(() => this.#authenticationService.authStatus())

  readonly authEffect = effect(() => {
    console.log('auth changed? ', this.authStatus())
  })

  async ngOnInit(): Promise<void> {
    console.log('Login page initialized, checking authentication...')
    await this.#authenticationService.authenticate()
    if (this.#authenticationService.authStatus() === 'authenticated') {
      await this.#doLogin()
    }
  }

  async login(): Promise<void> {
    const username = this.loginForm.controls.username.value
    const token = this.loginForm.controls.token.value

    if (username != null && token != null) {
      try {
        await this.#authenticationService.authenticate({ username, token })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {
        this.#unauthenticated()
      }
      await this.#doLogin()
    } else {
      this.#unauthenticated()
    }
  }

  #unauthenticated() {
    this.loginForm.setErrors({ unauthenticated: { means: 'bad' } })
  }

  async #doLogin(): Promise<boolean> {
    return this.#router.navigate([`/${LANDING_ROUTE_AFTER_LOGIN}`])
  }
}

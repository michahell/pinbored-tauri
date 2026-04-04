import { Component, inject } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { HlmButton } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
// import { HlmFieldImports } from '@spartan-ng/helm/field'
// import { HlmInputImports } from '@spartan-ng/helm/input'
import { Pinboard } from '../../services/pinboard/pinboard'
import { Router } from '@angular/router'

interface PinboardLoginForm {
  username: FormControl<string | null>
  password: FormControl<string | null>
}

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    HlmButton,
    HlmCardImports,
    // HlmFieldImports,
    // HlmInputImports,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {
  readonly #pinboard = inject(Pinboard)
  readonly #router = inject(Router)

  readonly loginForm = new FormGroup<PinboardLoginForm>({
    username: new FormControl('', {}),
    password: new FormControl('', {}),
  })

  async login(): Promise<void> {
    // reset invalid auth erorr
    this.loginForm.setErrors({ invalid: null })

    const username = this.loginForm.controls.username.value
    const password = this.loginForm.controls.password.value

    if (username != null && password != null) {
      // update username & password
      this.#pinboard.user = username
      this.#pinboard.password = password
      // make a request to see if auth is correct
      const apiToken = await this.#pinboard.getUserApiToken()
      if (apiToken != null) {
        await this.#router.navigate(['/bookmarks'])
      } else {
        // remove stored username & password in Pinboard service
        this.#pinboard.user = ''
        this.#pinboard.password = ''
        // reset login form
        this.loginForm.reset()
      }
    }
  }
}

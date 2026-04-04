import { Component, effect, inject, model } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HlmField, HlmFieldGroup, HlmFieldLabel } from '@spartan-ng/helm/field'
import { HlmInput } from '@spartan-ng/helm/input'
import { Pinboard } from '../../services/pinboard/pinboard'

@Component({
  selector: 'app-login',
  imports: [FormsModule, HlmField, HlmFieldGroup, HlmFieldLabel, HlmInput],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {
  readonly username = model<string | null>(null)
  readonly password = model<string | null>(null)

  readonly #pinboard = inject(Pinboard)

  constructor() {
    effect(() => {
      // update username
      const username = this.username()
      if (username != null) {
        this.#pinboard.user = username
      }
      // update password
      const password = this.password()
      if (password != null) {
        this.#pinboard.password = password
      }
    })
  }
}

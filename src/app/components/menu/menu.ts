import { Component, computed, inject } from '@angular/core'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { AuthenticationService } from '../../services/authentication/authentication-service'

@Component({
  selector: 'app-menu',
  imports: [HlmNavigationMenuImports, HlmButtonImports, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
})
export class Menu {
  #router = inject(Router)
  #authentication = inject(AuthenticationService)

  isLoggedIn = computed(() => this.#authentication.authStatus() === 'authenticated')

  async logout(): Promise<void> {
    await this.#authentication.logout()
    await this.#router.navigate(['/login'])
  }
}

import { Component, inject, OnInit, signal } from '@angular/core'
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu'
import { LocalStore } from '../../services/store/local-store'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-menu',
  imports: [HlmNavigationMenuImports, RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
})
export class Menu implements OnInit {
  #store = inject(LocalStore)
  #router = inject(Router)

  isLoggedIn = signal(false)

  async ngOnInit(): Promise<void> {
    const username = await this.#store.get('username')
    const password = await this.#store.get('password')
    if (username && password) {
      this.isLoggedIn.set(true)
    } else {
      this.isLoggedIn.set(false)
    }
  }

  async logout(): Promise<void> {
    await this.#store.set('username', null)
    await this.#store.set('password', null)
    await this.#router.navigate(['/login'])
  }
}

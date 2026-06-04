import { AfterViewInit, Component, computed, inject, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { AuthenticationService } from '@auth/authentication-service'
import { DebugInfo } from '@components/debug-info/debug-info'
import { Hotkey, HotkeysService } from '@ngneat/hotkeys'
import { debounceCallback } from '@signality/core'

interface MenuItem {
  text: string
  route: string
  keys: string
  group: string
  description: string
  global: boolean
}

@Component({
  selector: 'app-menu',
  imports: [HlmNavigationMenuImports, HlmButtonImports, RouterLink, RouterLinkActive, DebugInfo],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './menu.html',
})
export class Menu implements AfterViewInit, OnDestroy {
  readonly #router = inject(Router)
  readonly #authentication = inject(AuthenticationService)
  readonly #hotkeyService = inject(HotkeysService)

  readonly menuItems: MenuItem[] = [
    {
      text: 'bookmarks',
      route: 'bookmarks',
      keys: 'meta.b',
      group: 'menu',
      description: 'to go to bookmarks',
      global: true,
    },
    {
      text: 'tags',
      route: 'tags',
      keys: 'meta.t',
      group: 'menu',
      description: 'to go to tags',
      global: true,
    },
    {
      text: 'notes',
      route: 'notes',
      keys: 'meta.n',
      group: 'menu',
      description: 'to go to notes',
      global: true,
    },
    {
      text: 'settings',
      route: 'settings',
      keys: 'meta.s',
      group: 'menu',
      description: 'to go to settings',
      global: true,
    },
  ]

  readonly highlightHotkeys = signal(false)
  readonly #debounceHotkeyHighlights = debounceCallback(() => this.highlightHotkeys.set(false), 500)

  readonly isLoggedIn = computed(() => this.#authentication.authStatus() === 'authenticated')

  ngAfterViewInit(): void {
    // add menu item hotkeys
    this.menuItems.forEach((menuItem: MenuItem) => {
      this.#hotkeyService.addShortcut(menuItem as Hotkey).subscribe(() => {
        this.#router.navigate([`/${menuItem.route}`])
      })
    })

    // add hidden global META key to indicate menu hotkeys in blue
    this.#hotkeyService.addShortcut({ keys: 'meta', group: 'hidden', global: true }).subscribe(() => {
      this.handleMetaHotkeyDown()
    })
  }

  ngOnDestroy(): void {
    this.#hotkeyService.removeShortcuts(this.menuItems.map((menuItem) => menuItem.keys))
    this.#hotkeyService.removeShortcuts(['meta'])
  }

  async logout(): Promise<void> {
    await this.#authentication.logout()
    await this.#router.navigate(['/login'])
  }

  handleMetaHotkeyDown(): void {
    this.highlightHotkeys.set(true)
    this.#debounceHotkeyHighlights()
  }
}

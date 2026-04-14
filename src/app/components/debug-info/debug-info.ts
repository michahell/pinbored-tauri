import { Component, computed, inject } from '@angular/core'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { greenBadge, redBadge, skyBadge } from '../../constants/tailwind-styles'
import { AuthenticationService } from '../../services/authentication/authentication-service'
import { BookmarksService } from '../../services/bookmarks/bookmarks-service'
import { HlmAccordionImports } from '@spartan-ng/helm/accordion'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'

@Component({
  selector: 'app-debug-info',
  imports: [HlmBadge, HlmAccordionImports, HlmButtonImports, HlmIconImports],
  templateUrl: './debug-info.html',
  styleUrl: './debug-info.css',
})
export class DebugInfo {
  readonly redBadge = redBadge
  readonly skyBadge = skyBadge
  readonly greenBadge = greenBadge

  readonly #authentication = inject(AuthenticationService)
  readonly #bookmarks = inject(BookmarksService)

  isLoggedIn = computed(() => this.#authentication.authStatus() === 'authenticated')

  readonly bookmarksFetching = computed(() => this.#bookmarks.bookmarksFetching())
  readonly staleChecking = computed(() => this.#bookmarks.staleChecking())
  readonly hasBookmarks = computed(() => this.#bookmarks.hasBookmarks())
  // for queue
  readonly queueLength = computed(() => this.#bookmarks.queueLength())
  readonly queueExists = computed(() => this.#bookmarks.hasQueue())
}

import { Component, computed, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgTemplateOutlet } from '@angular/common'
import { HlmPopoverImports } from '@spartan-ng/helm/popover'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { greenBadge, redBadge, skyBadge } from '../../../styles/tailwind-styles'
import { AuthenticationService } from '@services/authentication/authentication-service'
import { BookmarksService } from '../../../pages/bookmarks/bookmarks-service'

@Component({
  selector: 'app-debug-info',
  imports: [NgTemplateOutlet, HlmBadge, HlmPopoverImports, HlmButtonImports],
  templateUrl: './debug-info.html',
})
export class DebugInfo {
  readonly redBadge = redBadge
  readonly skyBadge = skyBadge
  readonly greenBadge = greenBadge

  readonly #authentication = inject(AuthenticationService)
  readonly #bookmarks = inject(BookmarksService)
  readonly #activatedRoute = inject(ActivatedRoute)

  isLoggedIn = computed(() => this.#authentication.authStatus() === 'authenticated')
  routeDebug = computed<string[]>(() => {
    const route = this.#activatedRoute.snapshot.pathFromRoot.map((s) => s.url).join(' > ')
    const queryParams = Object.entries(this.#activatedRoute.snapshot.queryParams)
      .map(([key, value]) => `${key}:${value}`)
      .join(', ')
    const params = Object.entries(this.#activatedRoute.snapshot.params)
      .map(([key, value]) => `${key}:${value}`)
      .join(', ')
    return [route, queryParams, params]
  })

  readonly bookmarksFetching = computed(() => this.#bookmarks.bookmarksFetching())
  readonly staleChecking = computed(() => this.#bookmarks.staleChecking())
  readonly hasBookmarks = computed(() => this.#bookmarks.hasBookmarks())
  // for queue
  readonly queueLength = computed(() => this.#bookmarks.queueLength())
  readonly queueExists = computed(() => this.#bookmarks.hasQueue())
}

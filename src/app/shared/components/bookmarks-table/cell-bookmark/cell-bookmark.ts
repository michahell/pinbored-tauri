import { Component, computed, inject, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { skyBadge, yellowBadge } from '@styles/badge-colors'
import { BookmarkVM } from '@data-providers/abstract/models/abstract-view.model'
import { CommonSignalsService } from '@core/common-signals/common-signals-service'

@Component({
  imports: [HlmBadge, RouterLink],
  providers: [],
  templateUrl: './cell-bookmark.html',
})
export class CellBookmark {
  readonly #signalsService = inject(CommonSignalsService)
  readonly context = injectFlexRenderContext<CellContext<BookmarkVM, unknown>>()

  protected readonly skyBadge = skyBadge
  readonly isDesktop = computed(() => this.#signalsService.breakpoints.desktop())

  readonly highlightTag = input<string>('')
  protected readonly yellowBadge = yellowBadge
}

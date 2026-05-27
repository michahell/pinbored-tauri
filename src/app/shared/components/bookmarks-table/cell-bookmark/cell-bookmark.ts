import { Component, computed, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { skyBadge } from '@styles/badge-colors'
import { PinboardItemVM } from '@models/pinboard-view.model'
import { CommonSignalsService } from '@core/common-signals/common-signals-service'

@Component({
  imports: [HlmBadge, RouterLink],
  providers: [],
  templateUrl: './cell-bookmark.html',
})
export class CellBookmark {
  readonly #signalsService = inject(CommonSignalsService)
  readonly context = injectFlexRenderContext<CellContext<PinboardItemVM, unknown>>()

  readonly isDesktop = computed(() => this.#signalsService.breakpoints.desktop())

  protected readonly skyBadge = skyBadge
}

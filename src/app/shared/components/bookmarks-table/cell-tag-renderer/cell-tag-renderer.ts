import { Component, computed, input } from '@angular/core'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { BookmarkVM } from '@data-providers/abstract/models/abstract-view.model'
import { getStaleBadgeColor } from '@core/utils/stale-utils'

@Component({
  imports: [HlmBadge],
  providers: [],
  templateUrl: './cell-tag-renderer.html',
})
export class CellTagRenderer {
  readonly context = injectFlexRenderContext<CellContext<BookmarkVM, unknown>>()
  readonly status = input<string>()
  readonly color = computed(() => getStaleBadgeColor(this.status()))
}

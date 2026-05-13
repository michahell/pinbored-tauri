import { Component } from '@angular/core'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { skyBadge } from '../../../../styles/tailwind-styles'
import { RouterLink } from '@angular/router'
import { PinboardItemVM } from '@models/pinboard-view.model'

@Component({
  imports: [HlmBadge, RouterLink],
  providers: [],
  templateUrl: './cell-bookmark.html',
})
export class CellBookmark {
  readonly context = injectFlexRenderContext<CellContext<PinboardItemVM, unknown>>()
  protected readonly skyBadge = skyBadge
}

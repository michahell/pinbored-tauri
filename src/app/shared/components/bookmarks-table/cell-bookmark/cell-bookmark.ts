import { Component } from '@angular/core'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { skyBadge } from '../../../../styles/badge-colors'
import { PinboardItemVM } from '@models/pinboard-view.model'
import { RouterLink } from '@angular/router'

@Component({
  imports: [HlmBadge, RouterLink],
  providers: [],
  templateUrl: './cell-bookmark.html',
})
export class CellBookmark {
  readonly context = injectFlexRenderContext<CellContext<PinboardItemVM, unknown>>()
  protected readonly skyBadge = skyBadge
}

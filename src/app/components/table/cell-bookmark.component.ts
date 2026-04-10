import { Component } from '@angular/core'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { PinboardItemVM } from '../../models/pinboard-view.model'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { skyBadge } from '../../constants/tailwind-styles'
import { RouterLink } from '@angular/router'

@Component({
  imports: [HlmBadge, RouterLink],
  providers: [],
  templateUrl: './cell-bookmark.component.html',
})
export class CellBookmark {
  readonly context = injectFlexRenderContext<CellContext<PinboardItemVM, unknown>>()
  protected readonly skyBadge = skyBadge
}

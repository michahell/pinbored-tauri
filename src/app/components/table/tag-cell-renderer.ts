import { Component, computed, input } from '@angular/core'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { PinboardItemVM } from '../../models/pinboard-view.model'
import { greenBadge, redBadge, skyBadge, yellowBadge } from '../../constants/tailwind-styles'

@Component({
  imports: [HlmBadge],
  providers: [],
  templateUrl: './tag-cell-renderer.html',
})
export class TagCellRenderer {
  protected readonly _context = injectFlexRenderContext<CellContext<PinboardItemVM, unknown>>()
  readonly status = input<string>()
  readonly color = computed(() => {
    switch (this.status()) {
      case 'unchecked':
        return 'bg-primary'
      case 'stale':
        return redBadge()
      case 'maybe-stale':
        return yellowBadge()
      case 'checking':
        return skyBadge()
      case 'ok':
        return greenBadge()
      default:
        return ''
    }
  })
}

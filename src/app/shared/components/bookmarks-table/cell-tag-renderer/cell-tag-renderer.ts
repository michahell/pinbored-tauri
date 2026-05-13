import { Component, computed, input } from '@angular/core'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { greenBadge, redBadge, skyBadge, yellowBadge } from '../../../../styles/tailwind-styles'
import { PinboardItemVM } from '@models/pinboard-view.model'

@Component({
  imports: [HlmBadge],
  providers: [],
  templateUrl: './cell-tag-renderer.html',
})
export class CellTagRenderer {
  readonly context = injectFlexRenderContext<CellContext<PinboardItemVM, unknown>>()
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

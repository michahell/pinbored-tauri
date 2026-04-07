import { Component } from '@angular/core'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { PinboardItemVM } from '../../models/pinboard-view.model'

@Component({
  imports: [HlmBadge],
  providers: [],
  template: `<hlm-badge>{{ _context.cell.getValue() }}</hlm-badge>`,
})
export class TagsCellRenderer {
  protected readonly _context = injectFlexRenderContext<CellContext<PinboardItemVM, unknown>>()
}

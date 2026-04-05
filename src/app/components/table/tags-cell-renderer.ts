import { Component } from '@angular/core'
import {
  type HeaderContext,
  injectFlexRenderContext,
} from '@tanstack/angular-table'
import { HlmBadge } from '@spartan-ng/helm/badge'

@Component({
  imports: [HlmBadge],
  providers: [],
  template: `<hlm-badge>{{ _context.column.columns }}</hlm-badge>`,
})
export class TagsCellRenderer<T> {
  protected readonly _context =
    injectFlexRenderContext<HeaderContext<T, unknown>>()
}

import { Component } from '@angular/core'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { PinboardItemVM } from '@models/pinboard-view.model'
import { HlmBadge } from '@spartan-ng/helm/badge'

@Component({
  imports: [HlmBadge],
  providers: [],
  template: `
    @for (tag of tags; track $index) {
      &nbsp;<hlm-badge variant="secondary">{{ tag }}</hlm-badge>
    }
  `,
})
export class CellTagsRenderer {
  readonly #context = injectFlexRenderContext<CellContext<PinboardItemVM, unknown>>()
  readonly tags = this.#context.cell.getValue() as string[]
}

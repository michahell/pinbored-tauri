import { Component, ChangeDetectionStrategy } from '@angular/core'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { HlmBadge } from '@spartan-ng/helm/badge'
import { PinboardItemVM } from '@models/pinboard-view.model'

@Component({
  imports: [HlmBadge],
  providers: [],
  changeDetection: ChangeDetectionStrategy.Eager,
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

import { Component, ChangeDetectionStrategy } from '@angular/core'
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox'
import { type CellContext, type HeaderContext, injectFlexRenderContext } from '@tanstack/angular-table'

@Component({
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
    'aria-label': 'Select all',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <hlm-checkbox
      [checked]="_context.table.getIsAllRowsSelected()"
      [indeterminate]="_context.table.getIsSomeRowsSelected()"
      (checkedChange)="_context.table.toggleAllRowsSelected()"
    ></hlm-checkbox>
  `,
})
export class TableHeadSelection<T> {
  protected readonly _context = injectFlexRenderContext<HeaderContext<T, unknown>>()
}

@Component({
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
    'aria-label': 'Select Row',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <hlm-checkbox
      [checked]="_context.row.getIsSelected()"
      (checkedChange)="_context.row.getToggleSelectedHandler()($event)"
    />
  `,
})
export class TableRowSelection<T> {
  protected readonly _context = injectFlexRenderContext<CellContext<T, unknown>>()
}

import { Component, computed, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideArrowUpDown } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import {
  type HeaderContext,
  injectFlexRenderContext,
} from '@tanstack/angular-table'

@Component({
  imports: [],
  providers: [provideIcons({ lucideArrowUpDown })],
  template: `TODO statusIndicator`,
})
export class StatusIndicator<T> {
  protected readonly _context =
    injectFlexRenderContext<HeaderContext<T, unknown>>()
}

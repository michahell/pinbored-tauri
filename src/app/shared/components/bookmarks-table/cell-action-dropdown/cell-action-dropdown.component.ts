import { Component, inject, ChangeDetectionStrategy } from '@angular/core'
import { Router } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { PinboardFacade } from '../../../data-providers/pinboard/facade/pinboard-facade'
import { BookmarkVM } from '../../../data-providers/abstract/models/abstract-view.model'

@Component({
  selector: 'hlm-action-dropdown',
  imports: [NgIcon, HlmButtonImports, HlmIconImports, HlmDropdownMenuImports],
  providers: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button hlmBtn variant="ghost" class="h-8 w-8 p-0" [hlmDropdownMenuTrigger]="ActionDropDownMenu">
      <span class="sr-only">open menu</span>
      <ng-icon hlm size="sm" name="lucideEllipsis" />
    </button>

    <ng-template #ActionDropDownMenu>
      <hlm-dropdown-menu>
        <hlm-dropdown-menu-label>actions</hlm-dropdown-menu-label>
        <hlm-dropdown-menu-separator />
        <button hlmDropdownMenuItem (click)="editBookmark()"><ng-icon name="lucideEdit2" /> edit</button>
        <button hlmDropdownMenuItem (click)="deleteBookmark()" variant="destructive">
          <ng-icon name="lucideTrash2" /> delete
        </button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class CellActionDropdown {
  readonly #router = inject(Router)
  readonly #facade = inject(PinboardFacade)
  readonly #context = injectFlexRenderContext<CellContext<BookmarkVM, unknown>>()

  editBookmark() {
    const bookmark = this.#context.row.original
    this.#router.navigate(['bookmarks', '#', bookmark.hash]).then()
  }

  async deleteBookmark() {
    const bookmark = this.#context.row.original
    await this.#facade.deleteBookmark(bookmark.href)
  }
}

import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { type CellContext, injectFlexRenderContext } from '@tanstack/angular-table'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { lucideEllipsis } from '@ng-icons/lucide'
import { PinboardItemVM } from '@models/pinboard-view.model'
import { PinboardFacade } from '@core/pinboard/pinboard-facade'

@Component({
  selector: 'spartan-action-dropdown',
  imports: [NgIcon, HlmButtonImports, HlmIconImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideEllipsis })],
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
        <!--        <div>-->
        <!--          <button hlmBtn size="icon" variant="outline"></button>-->
        <!--        </div>-->
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class ActionDropdown {
  readonly #router = inject(Router)
  readonly #facade = inject(PinboardFacade)
  readonly #context = injectFlexRenderContext<CellContext<PinboardItemVM, unknown>>()

  editBookmark() {
    const bookmark = this.#context.row.original
    this.#router.navigate(['bookmarks', '#', bookmark.hash]).then()
  }

  async deleteBookmark() {
    const bookmark = this.#context.row.original
    await this.#facade.deleteBookmark(bookmark.href)
  }
}

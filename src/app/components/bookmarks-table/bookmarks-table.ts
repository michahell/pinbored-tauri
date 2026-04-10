import { Component, input, signal } from '@angular/core'
import {
  ColumnDef,
  ColumnFiltersState,
  createAngularTable,
  flexRenderComponent,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/angular-table'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmTableImports } from '@spartan-ng/helm/table'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { NgIcon } from '@ng-icons/core'
import { PinboardItemVM } from '../../models/pinboard-view.model'
import { TableHeadSelection, TableRowSelection } from '../table/selection-column'
import { FormsModule } from '@angular/forms'
import { CellTagRenderer } from '../table/cell-tag-renderer.component'
import { ActionDropdown } from '../table/action-dropdown'
import { CellBookmark } from '../table/cell-bookmark.component'

@Component({
  selector: 'app-bookmarks-table',
  imports: [
    FlexRenderDirective,
    FormsModule,
    NgIcon,
    HlmDropdownMenuImports,
    HlmButtonImports,
    HlmIconImports,
    HlmTableImports,
    HlmInputImports,
  ],
  templateUrl: './bookmarks-table.html',
})
export class BookmarksTable {
  readonly bookmarks = input<PinboardItemVM[]>()

  readonly #columnFilters = signal<ColumnFiltersState>([])
  readonly #sorting = signal<SortingState>([])
  readonly #rowSelection = signal<RowSelectionState>({})
  readonly #columnVisibility = signal<VisibilityState>({})

  protected readonly _columns: ColumnDef<PinboardItemVM>[] = [
    {
      id: 'hash',
      accessorKey: 'hash',
      header: () => flexRenderComponent(TableHeadSelection),
      cell: () => flexRenderComponent(TableRowSelection),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      id: 'status',
      header: 'stale status',
      enableHiding: false,
      enableSorting: false,
      cell: (context) =>
        flexRenderComponent(CellTagRenderer, {
          inputs: {
            status: context.cell.getValue() as string,
          },
        }),
    },
    {
      accessorKey: 'bookmark',
      id: 'href',
      enableSorting: false,
      enableHiding: true,
      cell: () => flexRenderComponent(CellBookmark),
    },
    {
      accessorKey: 'actions',
      id: 'actions',
      enableSorting: false,
      enableHiding: false,
      cell: () => flexRenderComponent(ActionDropdown),
    },
  ]

  protected readonly _table = createAngularTable<PinboardItemVM>(() => ({
    data: this.bookmarks() ?? [],
    columns: this._columns,
    onSortingChange: (updater) => {
      updater instanceof Function ? this.#sorting.update(updater) : this.#sorting.set(updater)
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function ? this.#columnFilters.update(updater) : this.#columnFilters.set(updater)
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (updater) => {
      updater instanceof Function ? this.#columnVisibility.update(updater) : this.#columnVisibility.set(updater)
    },
    onRowSelectionChange: (updater) => {
      updater instanceof Function ? this.#rowSelection.update(updater) : this.#rowSelection.set(updater)
    },
    state: {
      sorting: this.#sorting(),
      columnFilters: this.#columnFilters(),
      columnVisibility: this.#columnVisibility(),
      rowSelection: this.#rowSelection(),
    },
  }))

  protected readonly _hidableColumns = this._table.getAllColumns().filter((column) => column.getCanHide())

  protected _filterChanged(event: Event) {
    this._table.getColumn('status')?.setFilterValue((event.target as HTMLInputElement).value)
  }
}

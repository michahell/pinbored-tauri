import { Component, computed, input, signal } from '@angular/core'
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
import { NgIcon } from '@ng-icons/core'
import { PinboardItemVM } from '../../models/pinboard-view.model'
import { TableHeadSelection, TableRowSelection } from '../table/selection-column'
import { FormsModule } from '@angular/forms'
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { TagsCellRenderer } from '../table/tags-cell-renderer'
import { TagCellRenderer } from '../table/tag-cell-renderer'

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
    HlmProgress,
    HlmProgressIndicator,
  ],
  templateUrl: './bookmarks-table.html',
})
export class BookmarksTable {
  readonly bookmarks = input<Map<string, PinboardItemVM>>()
  readonly #bookmarksAsList = computed(() => {
    const bookmarks = this.bookmarks()
    if (bookmarks) {
      console.log('bookmarks as list updating...')
      return Array.from(bookmarks.values())
    } else {
      return []
    }
  })

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

      enableHiding: false,
      enableSorting: false,
      cell: () => flexRenderComponent(TagCellRenderer),
    },
    {
      accessorKey: 'description',
      id: 'description',
      enableSorting: false,
      enableHiding: true,
      cell: (info) => `<div class="">${info.getValue<string>()}</div>`,
    },
    {
      accessorKey: 'link',
      id: 'href',
      enableSorting: false,
      enableHiding: true,
      cell: (info) => `<div class="lowercase"><a href="${info.getValue<string>()}">url</a></div>`,
    },
    {
      accessorKey: 'tagsList',
      id: 'tagsList',
      header: 'tags',
      enableSorting: false,
      enableHiding: true,
      cell: () => flexRenderComponent(TagsCellRenderer),
    },
  ]

  protected readonly _table = createAngularTable<PinboardItemVM>(() => ({
    data: this.#bookmarksAsList(),
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
    this._table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value)
  }
}

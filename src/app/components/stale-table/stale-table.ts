import { Component, computed, input, signal } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { FormsModule } from '@angular/forms'
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
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmTableImports } from '@spartan-ng/helm/table'
import { lucideChevronDown } from '@ng-icons/lucide'
import {
  TableHeadSelection,
  TableRowSelection,
} from '../table/selection-column'
import { PinboardItemVM } from '../../models/pinboard-view.model'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmProgress, HlmProgressIndicator } from '@spartan-ng/helm/progress'

@Component({
  selector: 'app-stale-table',
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
  providers: [provideIcons({ lucideChevronDown })],
  host: {
    class: 'w-full',
  },
  templateUrl: './stale-table.html',
})
export class StaleTable {
  readonly bookmarks = input<Map<string, PinboardItemVM>>()
  readonly #bookmarksAsList = computed(() => {
    const bookmarks = this.bookmarks()
    if (bookmarks) {
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
      header: () => flexRenderComponent(TableHeadSelection),
      cell: () => flexRenderComponent(TableRowSelection),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'description',
      id: 'description',
      enableSorting: false,
      enableHiding: false,
      cell: (info) =>
        `<div class="text-right">${info.getValue<string>()}</div>`,
    },
    {
      accessorKey: 'href',
      id: 'href',
      enableSorting: false,
      enableHiding: false,
      cell: (info) => `<div class="lowercase">${info.getValue<string>()}</div>`,
    },
    {
      id: 'status',
      header: '<div class="text-right">Status</div>',
      enableHiding: false,
      enableSorting: false,
      cell: (info) =>
        `<div class="text-right">${info.getValue<string>()}</div>`,
      // cell: () => flexRenderComponent(StatusIndicator),
    },
  ]

  protected readonly _table = createAngularTable<PinboardItemVM>(() => ({
    data: this.#bookmarksAsList(),
    columns: this._columns,
    onSortingChange: (updater) => {
      updater instanceof Function
        ? this.#sorting.update(updater)
        : this.#sorting.set(updater)
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function
        ? this.#columnFilters.update(updater)
        : this.#columnFilters.set(updater)
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (updater) => {
      updater instanceof Function
        ? this.#columnVisibility.update(updater)
        : this.#columnVisibility.set(updater)
    },
    onRowSelectionChange: (updater) => {
      updater instanceof Function
        ? this.#rowSelection.update(updater)
        : this.#rowSelection.set(updater)
    },
    state: {
      sorting: this.#sorting(),
      columnFilters: this.#columnFilters(),
      columnVisibility: this.#columnVisibility(),
      rowSelection: this.#rowSelection(),
    },
  }))

  protected readonly _hidableColumns = this._table
    .getAllColumns()
    .filter((column) => column.getCanHide())

  protected _filterChanged(event: Event) {
    this._table
      .getColumn('email')
      ?.setFilterValue((event.target as HTMLInputElement).value)
  }
}

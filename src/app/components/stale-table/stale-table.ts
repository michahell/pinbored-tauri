import { Component, input, signal } from '@angular/core'
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
import { HlmInputImports } from '@spartan-ng/helm/input'
import {
  TableHeadSelection,
  TableRowSelection,
} from './components/selection-column'
import { TableHeadSortButton } from './components/sort-header-button'
import { ActionDropdown } from './components/action-dropdown'
import { Payment } from './stale-table.model'

@Component({
  selector: 'app-stale-table',
  imports: [
    FlexRenderDirective,
    FormsModule,
    NgIcon,
    HlmDropdownMenuImports,
    HlmButtonImports,
    HlmIconImports,
    HlmInputImports,
    HlmTableImports,
  ],
  providers: [provideIcons({ lucideChevronDown })],
  host: {
    class: 'w-full',
  },
  templateUrl: './stale-table.html',
  styleUrl: './stale-table.css',
})
export class StaleTable {
  readonly data = input<Payment[]>()

  readonly #columnFilters = signal<ColumnFiltersState>([])
  readonly #sorting = signal<SortingState>([])
  readonly #rowSelection = signal<RowSelectionState>({})
  readonly #columnVisibility = signal<VisibilityState>({})

  protected readonly _columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: () => flexRenderComponent(TableHeadSelection),
      cell: () => flexRenderComponent(TableRowSelection),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      id: 'status',
      header: 'Status',
      enableSorting: false,
      cell: (info) =>
        `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'email',
      id: 'email',
      header: () =>
        flexRenderComponent(TableHeadSortButton, { inputs: { header: '' } }),
      cell: (info) => `<div class="lowercase">${info.getValue<string>()}</div>`,
    },
    {
      accessorKey: 'amount',
      id: 'amount',
      header: '<div class="text-right">Amount</div>',
      enableSorting: false,
      cell: (info) => {
        const amount = parseFloat(info.getValue<string>())
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount)

        return `<div class="text-right">${formatted}</div>`
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => flexRenderComponent(ActionDropdown),
    },
  ]

  protected readonly _table = createAngularTable<Payment>(() => ({
    data: this.data() ?? [],
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

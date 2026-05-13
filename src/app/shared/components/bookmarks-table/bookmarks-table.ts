import { Component, input, OnInit, signal } from '@angular/core'
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
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmIconImports } from '@spartan-ng/helm/icon'
import { HlmTableImports } from '@spartan-ng/helm/table'
import { NgIcon } from '@ng-icons/core'
import { PinboardItemVM } from '@models/pinboard-view.model'
import { TableHeadSelection, TableRowSelection } from '../table/selection-column'
import { CellTagRenderer } from '../table/cell-tag-renderer'
import { ActionDropdown } from '../table/action-dropdown'
import { CellBookmark } from '../table/cell-bookmark'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { NgxLoadingBar } from '@ngx-loading-bar/core'

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
    HlmInputGroupImports,
    NgxLoadingBar,
  ],
  templateUrl: './bookmarks-table.html',
})
export class BookmarksTable implements OnInit {
  readonly bookmarks = input<PinboardItemVM[]>()

  readonly #columnFilters = signal<ColumnFiltersState>([])
  readonly #sorting = signal<SortingState>([])
  readonly #rowSelection = signal<RowSelectionState>({})
  readonly #columnVisibility = signal<VisibilityState>({})

  protected readonly columns: ColumnDef<PinboardItemVM>[] = [
    {
      id: 'hash',
      accessorKey: 'hash',
      header: () => flexRenderComponent(TableHeadSelection),
      cell: () => flexRenderComponent(TableRowSelection),
      enableSorting: false,
      enableHiding: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: 'status',
      id: 'status',
      header: 'stale status',
      enableHiding: false,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (context) =>
        flexRenderComponent(CellTagRenderer, {
          inputs: {
            status: context.cell.getValue() as string,
          },
        }),
    },
    {
      accessorKey: 'bookmark',
      id: 'bookmark',
      enableSorting: false,
      enableHiding: false,
      enableGlobalFilter: false,
      cell: () => flexRenderComponent(CellBookmark),
    },
    {
      accessorKey: 'actions',
      id: 'actions',
      enableSorting: false,
      enableHiding: false,
      enableGlobalFilter: false,
      cell: () => flexRenderComponent(ActionDropdown),
    },
    {
      id: 'href',
      accessorKey: 'href',
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'description',
      accessorKey: 'description',
      enableSorting: false,
      enableHiding: false,
    },
  ]

  protected readonly table = createAngularTable<PinboardItemVM>(() => ({
    data: this.bookmarks() ?? [],
    initialState: {
      pagination: {
        pageSize: 9,
      },
    },
    columns: this.columns,
    onSortingChange: (updater) => {
      updater instanceof Function ? this.#sorting.update(updater) : this.#sorting.set(updater)
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function ? this.#columnFilters.update(updater) : this.#columnFilters.set(updater)
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // needed for client-side global filtering
    globalFilterFn: 'includesString',
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

  protected readonly hidableColumns = this.table.getAllColumns().filter((column) => column.getCanHide())

  ngOnInit(): void {
    // hide the href and description columns - only used for searching
    this.#columnVisibility.update((visibilityState) => ({
      ...visibilityState,
      href: false,
      description: false,
    }))
  }

  protected filterStatusChanged(event: Event) {
    this.table.getColumn('status')?.setFilterValue((event.target as HTMLInputElement).value)
  }

  protected clearFilterStatus(element: HTMLInputElement): void {
    element.value = ''
    this.table.getColumn('status')?.setFilterValue('')
  }

  protected filterTextChanged(event: Event) {
    this.table.setGlobalFilter((event.target as HTMLInputElement).value)
  }

  protected clearFilterText(element: HTMLInputElement): void {
    element.value = ''
    this.table.setGlobalFilter('')
  }
}

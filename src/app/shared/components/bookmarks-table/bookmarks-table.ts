import { Component, inject, input, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
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
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { NgIcon } from '@ng-icons/core'
import { BookmarkVM } from '@data-providers/abstract/models/abstract-view.model'
import { TableHeadSelection, TableRowSelection } from '../table/selection-column'
import { CellTagRenderer } from './cell-tag-renderer/cell-tag-renderer'
import { CellActionDropdown } from './cell-action-dropdown/cell-action-dropdown.component'
import { CellBookmark } from './cell-bookmark/cell-bookmark'
import { NgxLoadingBar } from '@ngx-loading-bar/core'
import { BOOKMARKS_PAGE_DEFAULT_PAGE_SIZE } from '@core/constants/app-constants'

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
  readonly #router = inject(Router)

  readonly bookmarks = input<BookmarkVM[]>([])

  readonly #columnFilters = signal<ColumnFiltersState>([])
  readonly #sorting = signal<SortingState>([])
  readonly #rowSelection = signal<RowSelectionState>({})
  readonly #columnVisibility = signal<VisibilityState>({})

  readonly highlightTag = input<string>('')

  protected readonly columns: ColumnDef<BookmarkVM>[] = [
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
      cell: () => flexRenderComponent(CellBookmark, { inputs: { highlightTag: this.highlightTag() } }),
    },
    {
      accessorKey: 'actions',
      id: 'actions',
      enableSorting: false,
      enableHiding: false,
      enableGlobalFilter: false,
      cell: () => flexRenderComponent(CellActionDropdown),
    },
    {
      // not shown but added to be able to search it
      id: 'href',
      accessorKey: 'href',
      enableSorting: false,
      enableHiding: false,
    },
    {
      // not shown but added to be able to search it
      id: 'description',
      accessorKey: 'description',
      enableSorting: false,
      enableHiding: false,
    },
  ]

  protected readonly table = createAngularTable<BookmarkVM>(() => ({
    data: this.bookmarks(),
    initialState: {
      pagination: {
        pageSize: BOOKMARKS_PAGE_DEFAULT_PAGE_SIZE,
      },
    },
    columns: this.columns,
    onSortingChange: (updater) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      updater instanceof Function ? this.#sorting.update(updater) : this.#sorting.set(updater)
    },
    onColumnFiltersChange: (updater) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      updater instanceof Function ? this.#columnFilters.update(updater) : this.#columnFilters.set(updater)
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // needed for client-side global filtering
    globalFilterFn: 'includesString',
    onColumnVisibilityChange: (updater) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      updater instanceof Function ? this.#columnVisibility.update(updater) : this.#columnVisibility.set(updater)
    },
    onRowSelectionChange: (updater) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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

  protected goToBookmark(event: MouseEvent, bookmark: BookmarkVM): void {
    if (event.target instanceof HTMLAnchorElement || event.target instanceof HTMLButtonElement) {
      return
    }
    if (
      event.target instanceof HTMLTableElement ||
      event.target instanceof HTMLDivElement ||
      event.target instanceof HTMLSpanElement
    ) {
      this.#router.navigate(['bookmarks', bookmark.hash])
    }
  }
}

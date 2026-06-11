import { Component, inject, input, signal } from '@angular/core'
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
  SortingState,
} from '@tanstack/angular-table'
import { HlmTableImports } from '@spartan-ng/helm/table'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group'
import { TableHeadSortButton } from '../table/sort-header-button'
import { CellTagActionRenderer } from './cell-tag-action-renderer'
import { HlmIcon } from '@spartan-ng/helm/icon'
import { NgIcon } from '@ng-icons/core'
import { TagsService } from '@services/tags/tags-service'
import { TagVM } from '@data-providers/abstract'

@Component({
  selector: 'app-tags-table',
  imports: [
    HlmTableImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmInputGroupImports,
    FlexRenderDirective,
    HlmIcon,
    NgIcon,
  ],
  templateUrl: './tags-table.html',
})
export class TagsTable {
  readonly #tagsService = inject(TagsService)

  readonly tags = input<TagVM[]>([])
  readonly #sorting = signal<SortingState>([])
  readonly #columnFilters = signal<ColumnFiltersState>([])

  protected readonly columns: ColumnDef<TagVM>[] = [
    {
      accessorKey: 'name',
      id: 'name',
      header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: 'name' } }),
      enableSorting: true,
    },
    {
      accessorKey: 'count',
      id: 'count',
      header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: 'count' } }),
      enableSorting: true,
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'actions',
      enableSorting: false,
      cell: () => flexRenderComponent(CellTagActionRenderer),
    },
  ]

  protected readonly table = createAngularTable<TagVM>(() => ({
    data: this.tags(),
    initialState: {
      pagination: {
        pageSize: 9,
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
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: this.#sorting(),
      columnFilters: this.#columnFilters(),
    },
  }))

  openEditModal(tag: TagVM): void {
    this.#tagsService.openTagEditModal(tag)
  }

  filterTextChanged(event: Event) {
    this.table.setGlobalFilter((event.target as HTMLInputElement).value)
  }

  clearFilterText(element: HTMLInputElement): void {
    element.value = ''
    this.table.setGlobalFilter('')
  }
}

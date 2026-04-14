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
import { HlmDialogService } from '@spartan-ng/helm/dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { TagVM } from '../../models/tag-view.model'
import { TableHeadSortButton } from '../table/sort-header-button'
import { TagActionCell } from './tag-action-cell'
import { TagEditModal } from './tag-edit-modal/tag-edit-modal'
import { TagEditStateService } from './tag-edit-state.service'

@Component({
  selector: 'app-tags-table',
  imports: [FlexRenderDirective, HlmTableImports, HlmButtonImports],
  templateUrl: './tags-table.html',
})
export class TagsTable {
  readonly tags = input<TagVM[]>([])

  readonly #tagEditState = inject(TagEditStateService)
  readonly #dialogService = inject(HlmDialogService)

  readonly #sorting = signal<SortingState>([])
  readonly #columnFilters = signal<ColumnFiltersState>([])

  protected readonly _columns: ColumnDef<TagVM>[] = [
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
      cell: () => flexRenderComponent(TagActionCell),
    },
  ]

  protected readonly _table = createAngularTable<TagVM>(() => ({
    data: this.tags(),
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
    state: {
      sorting: this.#sorting(),
      columnFilters: this.#columnFilters(),
    },
  }))

  openEditModal(tag: TagVM): void {
    this.#tagEditState.selectedTag.set(tag)
    const ref = this.#dialogService.open(TagEditModal, { contentClass: 'sm:max-w-2xl' })
    this.#tagEditState.close = () => ref.close()
  }
}

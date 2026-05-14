import { ComponentFixture, TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TableHeadSortButton } from './sort-header-button'
import { provideAllIcons } from '../../core/provide-all-icons'

const mockColumn = vi.hoisted(() => ({
  id: 'name',
  toggleSorting: vi.fn(),
  getIsSorted: vi.fn().mockReturnValue(false),
}))

vi.mock('@tanstack/angular-table', () => ({
  injectFlexRenderContext: () => ({ column: mockColumn }),
}))

describe('TableHeadSortButton', () => {
  let component: TableHeadSortButton<unknown>
  let fixture: ComponentFixture<TableHeadSortButton<unknown>>

  beforeEach(async () => {
    mockColumn.toggleSorting.mockReset()
    mockColumn.getIsSorted.mockReturnValue(false)

    await TestBed.configureTestingModule({
      imports: [TableHeadSortButton],
      providers: [provideAllIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(TableHeadSortButton)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('uses column.id as label when header input is empty', () => {
    expect(component['_header']()).toBe('name')
  })

  it('uses the header input as label when provided', () => {
    fixture.componentRef.setInput('header', 'Custom Label')
    expect(component['_header']()).toBe('Custom Label')
  })

  it('calls toggleSorting(false) when column is not sorted', () => {
    mockColumn.getIsSorted.mockReturnValue(false)
    component['filterClick']()
    expect(mockColumn.toggleSorting).toHaveBeenCalledWith(false)
  })

  it('calls toggleSorting(true) when column is currently sorted asc', () => {
    mockColumn.getIsSorted.mockReturnValue('asc')
    component['filterClick']()
    expect(mockColumn.toggleSorting).toHaveBeenCalledWith(true)
  })

  it('calls toggleSorting(false) when column is sorted desc', () => {
    mockColumn.getIsSorted.mockReturnValue('desc')
    component['filterClick']()
    expect(mockColumn.toggleSorting).toHaveBeenCalledWith(false)
  })
})

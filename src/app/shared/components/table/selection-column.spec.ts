import { ComponentFixture, TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TableHeadSelection, TableRowSelection } from './selection-column'
import { provideAllIcons } from '@core/utils/provide-all-icons'

// A single mock context that satisfies both TableHeadSelection (needs .table)
// and TableRowSelection (needs .row) since vi.mock applies to the whole file.
const mockContext = vi.hoisted(() => ({
  table: {
    getIsAllRowsSelected: vi.fn().mockReturnValue(false),
    getIsSomeRowsSelected: vi.fn().mockReturnValue(false),
    toggleAllRowsSelected: vi.fn(),
  },
  row: {
    getIsSelected: vi.fn().mockReturnValue(false),
    getToggleSelectedHandler: vi.fn().mockReturnValue(vi.fn()),
  },
}))

vi.mock('@tanstack/angular-table', () => ({
  injectFlexRenderContext: () => mockContext,
}))

describe('TableHeadSelection', () => {
  let component: TableHeadSelection<unknown>
  let fixture: ComponentFixture<TableHeadSelection<unknown>>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeadSelection],
      providers: [provideAllIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(TableHeadSelection)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

describe('TableRowSelection', () => {
  let component: TableRowSelection<unknown>
  let fixture: ComponentFixture<TableRowSelection<unknown>>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableRowSelection],
      providers: [provideAllIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(TableRowSelection)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

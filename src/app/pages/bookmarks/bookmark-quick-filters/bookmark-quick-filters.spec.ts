import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BookmarkQuickFilters } from './bookmark-quick-filters'

describe('BookmarkQuickFilters', () => {
  let component: BookmarkQuickFilters
  let fixture: ComponentFixture<BookmarkQuickFilters>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookmarkQuickFilters],
    }).compileComponents()

    fixture = TestBed.createComponent(BookmarkQuickFilters)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

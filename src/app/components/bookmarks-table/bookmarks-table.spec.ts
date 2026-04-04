import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BookmarksTable } from './bookmarks-table'

describe('BookmarksTable', () => {
  let component: BookmarksTable
  let fixture: ComponentFixture<BookmarksTable>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookmarksTable],
    }).compileComponents()

    fixture = TestBed.createComponent(BookmarksTable)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { BookmarksTable } from './bookmarks-table'
import { PinboardItemVM } from '../../models/pinboard-view.model'
import { provideAllIcons } from '../../core/utils/provide-all-icons'

function makeBookmark(overrides: Partial<PinboardItemVM> = {}): PinboardItemVM {
  return {
    hash: 'abc123',
    href: 'https://example.com',
    description: 'Test bookmark',
    extended: '',
    meta: '',
    shared: 'no',
    tags: 'dev tools',
    time: '2024-01-01',
    toread: 'no',
    tagsList: ['dev', 'tools'],
    status: 'unchecked',
    ...overrides,
  }
}

describe('BookmarksTable', () => {
  let component: BookmarksTable
  let fixture: ComponentFixture<BookmarksTable>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookmarksTable],
      providers: [provideAllIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(BookmarksTable)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('renders with an empty bookmarks input', () => {
    fixture.componentRef.setInput('bookmarks', [])
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('renders with a populated bookmarks input', () => {
    const bookmarks = [makeBookmark(), makeBookmark({ hash: 'def456', description: 'Another bookmark' })]
    fixture.componentRef.setInput('bookmarks', bookmarks)
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('renders with bookmarks of various statuses', () => {
    const bookmarks: PinboardItemVM[] = [
      makeBookmark({ status: 'unchecked' }),
      makeBookmark({ hash: 'b', status: 'ok' }),
      makeBookmark({ hash: 'c', status: 'stale' }),
      makeBookmark({ hash: 'd', status: 'maybe-stale' }),
      makeBookmark({ hash: 'e', status: 'checking' }),
    ]
    fixture.componentRef.setInput('bookmarks', bookmarks)
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})

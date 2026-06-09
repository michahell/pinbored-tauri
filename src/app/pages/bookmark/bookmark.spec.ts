import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { signal } from '@angular/core'
import { of } from 'rxjs'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Bookmark from './bookmark'
import { provideAllIcons } from '../../shared/core/utils/provide-all-icons'
import { BookmarksService } from '../../shared/services/bookmarks/bookmarks-service'
import { TagsService } from '../../shared/services/tags/tags-service'
import { openUrl } from '@tauri-apps/plugin-opener'

vi.mock('@tauri-apps/plugin-opener', () => ({ openUrl: vi.fn() }))

const testBookmark = {
  hash: 'test-hash',
  description: 'Test Bookmark',
  href: 'https://example.com',
  tags: 'foo bar',
  tagsList: ['foo', 'bar'],
  extended: '',
  shared: 'no',
  status: 'unchecked' as const,
  meta: '',
  time: '2024-01-01',
  toread: 'no',
}

describe('Bookmark', () => {
  let component: Bookmark
  let fixture: ComponentFixture<Bookmark>

  beforeEach(async () => {
    const mockBookmarksService = {
      bookmarks: signal([testBookmark]),
      getAllBookmarks: vi.fn().mockResolvedValue(undefined),
    }
    const mockTagsService = {
      suggestTagsForUrl: vi.fn().mockResolvedValue({ popular: [], recommended: [] }),
    }
    const mockActivatedRoute = {
      params: of({ bookmark: 'test-hash' }),
    }

    await TestBed.configureTestingModule({
      imports: [Bookmark],
      providers: [
        provideAllIcons,
        { provide: BookmarksService, useValue: mockBookmarksService },
        { provide: TagsService, useValue: mockTagsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(Bookmark)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('openBookmark() calls openUrl with the bookmark href', async () => {
    await component.openBookmark()
    expect(openUrl).toHaveBeenCalledWith(testBookmark.href)
  })
})

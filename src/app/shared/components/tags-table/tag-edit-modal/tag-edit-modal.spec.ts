import { ComponentFixture, TestBed } from '@angular/core/testing'
import { signal } from '@angular/core'
import { DIALOG_DATA } from '@angular/cdk/dialog'
import { BrnDialogRef } from '@spartan-ng/brain/dialog'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TagEditModal } from './tag-edit-modal'
import { TagsService } from '@services/tags/tags-service'
import { BookmarksService } from '@services/bookmarks/bookmarks-service'
import { PinboardItemVM } from '@models/pinboard-view.model'

function makeBookmark(overrides: Partial<PinboardItemVM> = {}): PinboardItemVM {
  return {
    hash: 'abc123',
    href: 'https://example.com',
    description: 'Example',
    extended: '',
    meta: '',
    shared: 'no',
    tags: 'javascript',
    time: '2024-01-01',
    toread: 'no',
    tagsList: ['javascript'],
    status: 'unchecked',
    ...overrides,
  }
}

describe('TagEditModal', () => {
  let component: TagEditModal
  let fixture: ComponentFixture<TagEditModal>
  let mockTagsService: {
    renameTag: ReturnType<typeof vi.fn>
    closeTagEditModal: ReturnType<typeof vi.fn>
  }
  let bookmarksSignal: ReturnType<typeof signal<PinboardItemVM[]>>

  beforeEach(async () => {
    mockTagsService = {
      renameTag: vi.fn().mockResolvedValue(undefined),
      closeTagEditModal: vi.fn(),
    }
    bookmarksSignal = signal([makeBookmark()])

    await TestBed.configureTestingModule({
      imports: [TagEditModal],
      providers: [
        { provide: DIALOG_DATA, useValue: { selectedTag: { name: 'javascript', count: 5 } } },
        {
          provide: BrnDialogRef,
          useValue: {
            close: vi.fn(),
            state: vi.fn().mockReturnValue('open'),
            setAriaLabelledBy: vi.fn(),
            setAriaDescribedBy: vi.fn(),
            setAriaLabel: vi.fn(),
          },
        },
        { provide: TagsService, useValue: mockTagsService },
        { provide: BookmarksService, useValue: { bookmarks: bookmarksSignal } },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(TagEditModal)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('initialises newName with the tag name', () => {
    expect(component['newName']()).toBe('javascript')
  })

  it('taggedBookmarks returns bookmarks that include the tag', () => {
    expect(component['taggedBookmarks']().length).toBe(1)
  })

  it('taggedBookmarks excludes bookmarks without the tag', () => {
    bookmarksSignal.set([makeBookmark({ tagsList: ['typescript'] })])
    expect(component['taggedBookmarks']().length).toBe(0)
  })

  it('close() calls tagsService.closeTagEditModal', () => {
    component.close()
    expect(mockTagsService.closeTagEditModal).toHaveBeenCalled()
  })

  it('save() calls tagsService.renameTag with old and new names', async () => {
    component['newName'].set('js')
    await component.save()
    expect(mockTagsService.renameTag).toHaveBeenCalledWith('javascript', 'js')
  })

  it('save() closes the modal after renaming', async () => {
    await component.save()
    expect(mockTagsService.closeTagEditModal).toHaveBeenCalled()
  })

  it('save() does nothing when newName is blank', async () => {
    component['newName'].set('   ')
    await component.save()
    expect(mockTagsService.renameTag).not.toHaveBeenCalled()
  })
})

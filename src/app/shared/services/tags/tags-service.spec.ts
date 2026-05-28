import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TagsService } from './tags-service'
import { PinboardFacade } from '../../core/pinboard-facade/pinboard-facade'
import { LocalStoreService } from '../../core/store/local-store-service'
import { HlmDialogService } from '@spartan-ng/helm/dialog'

describe('TagsService', () => {
  let service: TagsService
  let mockFacade: {
    getAllTags: ReturnType<typeof vi.fn>
    renameTag: ReturnType<typeof vi.fn>
    deleteTag: ReturnType<typeof vi.fn>
  }
  let mockLocalStore: { set: ReturnType<typeof vi.fn> }
  let mockDialogRef: { close: ReturnType<typeof vi.fn>; state: ReturnType<typeof vi.fn> }
  let mockDialogService: { open: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockDialogRef = { close: vi.fn(), state: vi.fn().mockReturnValue('closed') }
    mockFacade = {
      getAllTags: vi.fn().mockResolvedValue({}),
      renameTag: vi.fn().mockResolvedValue(undefined),
      deleteTag: vi.fn().mockResolvedValue(undefined),
    }
    mockLocalStore = { set: vi.fn().mockResolvedValue(undefined) }
    mockDialogService = { open: vi.fn().mockReturnValue(mockDialogRef) }

    TestBed.configureTestingModule({
      providers: [
        TagsService,
        { provide: PinboardFacade, useValue: mockFacade },
        { provide: LocalStoreService, useValue: mockLocalStore },
        { provide: HlmDialogService, useValue: mockDialogService },
      ],
    })
    service = TestBed.inject(TagsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('hasTags', () => {
    it('is false when tags are empty', () => {
      expect(service.hasTags()).toBe(false)
    })

    it('is true after tags are loaded', async () => {
      mockFacade.getAllTags.mockResolvedValue({ javascript: '42' })
      await service.getAllTags()
      expect(service.hasTags()).toBe(true)
    })
  })

  describe('getAllTags()', () => {
    it('maps a PinboardTagsMap to TagVMs', async () => {
      mockFacade.getAllTags.mockResolvedValue({ javascript: '42', typescript: '17' })
      await service.getAllTags()
      expect(service.tags()).toEqual(
        expect.arrayContaining([
          { name: 'javascript', count: 42 },
          { name: 'typescript', count: 17 },
        ])
      )
    })

    it('sets tagsFetching to false after completion', async () => {
      await service.getAllTags()
      expect(service.tagsFetching()).toBe(false)
    })

    it('resets tags to [] on error', async () => {
      service.tags.set([{ name: 'old', count: 1 }])
      mockFacade.getAllTags.mockRejectedValue(new Error('network error'))
      await service.getAllTags()
      expect(service.tags()).toEqual([])
    })
  })

  describe('renameTag()', () => {
    it('calls facade.renameTag with old and new names', async () => {
      service.tags.set([{ name: 'js', count: 10 }])
      await service.renameTag('js', 'javascript')
      expect(mockFacade.renameTag).toHaveBeenCalledWith('js', 'javascript')
    })

    it('updates the tag name in the tags signal', async () => {
      service.tags.set([{ name: 'js', count: 10 }])
      await service.renameTag('js', 'javascript')
      expect(service.tags()[0].name).toBe('javascript')
    })

    it('persists the updated tags to local store', async () => {
      service.tags.set([{ name: 'js', count: 10 }])
      await service.renameTag('js', 'javascript')
      expect(mockLocalStore.set).toHaveBeenCalledWith('tags', { javascript: '10' })
    })
  })

  describe('deleteTag()', () => {
    it('calls facade.deleteTag with the tag name', async () => {
      service.tags.set([{ name: 'obsolete', count: 3 }])
      await service.deleteTag('obsolete')
      expect(mockFacade.deleteTag).toHaveBeenCalledWith('obsolete')
    })

    it('removes the tag from the tags signal', async () => {
      service.tags.set([
        { name: 'obsolete', count: 3 },
        { name: 'keep', count: 7 },
      ])
      await service.deleteTag('obsolete')
      expect(service.tags().map((t) => t.name)).toEqual(['keep'])
    })
  })

  describe('openTagEditModal()', () => {
    it('opens the dialog via dialogService', () => {
      service.openTagEditModal({ name: 'javascript', count: 5 })
      expect(mockDialogService.open).toHaveBeenCalledOnce()
    })

    it('does not open a second dialog when one is already open', () => {
      mockDialogRef.state.mockReturnValue('open')
      service.openTagEditModal({ name: 'javascript', count: 5 })
      service.openTagEditModal({ name: 'javascript', count: 5 })
      expect(mockDialogService.open).toHaveBeenCalledOnce()
    })
  })

  describe('closeTagEditModal()', () => {
    it('closes the dialog ref when one is open', () => {
      service.openTagEditModal({ name: 'javascript', count: 5 })
      service.closeTagEditModal()
      expect(mockDialogRef.close).toHaveBeenCalled()
    })
  })
})

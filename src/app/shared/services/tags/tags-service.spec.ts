import { TestBed } from '@angular/core/testing'
import { computed, signal, WritableSignal } from '@angular/core'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TagsService } from './tags-service'
import { DataProviderFacade } from '@services/data-provider/data-provider-facade'
import { HlmDialogService } from '@spartan-ng/helm/dialog'
import { SignalStore } from '@services/signal-store'
import { TagVM } from '@data-providers/abstract'

describe('TagsService', () => {
  let service: TagsService
  let tagsSignal: WritableSignal<TagVM[]>
  let mockFacade: {
    getAllTags: ReturnType<typeof vi.fn>
    renameTag: ReturnType<typeof vi.fn>
    deleteTag: ReturnType<typeof vi.fn>
    suggestTagsForUrl: ReturnType<typeof vi.fn>
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSignalStore: any
  let mockDialogRef: { close: ReturnType<typeof vi.fn>; state: ReturnType<typeof vi.fn> }
  let mockDialogService: { open: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    tagsSignal = signal<TagVM[]>([])
    const hasTagsSignal = computed(() => tagsSignal().length > 0)

    mockSignalStore = {
      get tags() {
        return tagsSignal
      },
      get hasTags() {
        return hasTagsSignal
      },
      setTags: vi.fn().mockImplementation((tags: TagVM[]) => tagsSignal.set(tags)),
      mutateTag: vi.fn().mockImplementation((oldName: string, newName: string) => {
        tagsSignal.update((tags) => tags.map((t) => (t.name === oldName ? { ...t, name: newName } : t)))
      }),
      deleteTag: vi.fn().mockImplementation((name: string) => {
        tagsSignal.update((tags) => tags.filter((t) => t.name !== name))
      }),
    }

    mockDialogRef = { close: vi.fn(), state: vi.fn().mockReturnValue('closed') }
    mockFacade = {
      getAllTags: vi.fn().mockResolvedValue({}),
      renameTag: vi.fn().mockResolvedValue(undefined),
      deleteTag: vi.fn().mockResolvedValue(undefined),
      suggestTagsForUrl: vi.fn().mockResolvedValue(undefined),
    }
    mockDialogService = { open: vi.fn().mockReturnValue(mockDialogRef) }

    TestBed.configureTestingModule({
      providers: [
        TagsService,
        { provide: DataProviderFacade, useValue: mockFacade },
        { provide: SignalStore, useValue: mockSignalStore },
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
      mockFacade.getAllTags.mockRejectedValue(new Error('network error'))
      await service.getAllTags()
      expect(service.tags()).toEqual([])
    })
  })

  describe('renameTag()', () => {
    it('calls facade.renameTag with old and new names', async () => {
      await service.renameTag('js', 'javascript')
      expect(mockFacade.renameTag).toHaveBeenCalledWith('js', 'javascript')
    })

    it('calls signalStore.mutateTag with old and new names', async () => {
      await service.renameTag('js', 'javascript')
      expect(mockSignalStore.mutateTag).toHaveBeenCalledWith('js', 'javascript')
    })

    it('updates the tag name in the tags signal', async () => {
      tagsSignal.set([{ name: 'js', count: 10 }])
      await service.renameTag('js', 'javascript')
      expect(service.tags()[0].name).toBe('javascript')
    })
  })

  describe('deleteTag()', () => {
    it('calls facade.deleteTag with the tag name', async () => {
      await service.deleteTag('obsolete')
      expect(mockFacade.deleteTag).toHaveBeenCalledWith('obsolete')
    })

    it('removes the tag from the tags signal', async () => {
      tagsSignal.set([
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

import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TagModalService } from './tag-modal-service'
import { HlmDialogService } from '@spartan-ng/helm/dialog'
import { TagVM } from '@data-providers/abstract/models/abstract-view.model'

describe('TagModalService', () => {
  let service: TagModalService
  let mockDialogRef: { close: ReturnType<typeof vi.fn>; state: ReturnType<typeof vi.fn> }
  let mockDialogService: { open: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockDialogRef = { close: vi.fn(), state: vi.fn().mockReturnValue('closed') }
    mockDialogService = { open: vi.fn().mockReturnValue(mockDialogRef) }

    TestBed.configureTestingModule({
      providers: [TagModalService, { provide: HlmDialogService, useValue: mockDialogService }],
    })
    service = TestBed.inject(TagModalService)
  })

  const tag: TagVM = { name: 'javascript', count: 5 }

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('openTagEditModal()', () => {
    it('opens the dialog via dialogService', () => {
      service.openTagEditModal(tag)
      expect(mockDialogService.open).toHaveBeenCalledOnce()
    })

    it('does not open a second dialog when one is already open', () => {
      mockDialogRef.state.mockReturnValue('open')
      service.openTagEditModal(tag)
      service.openTagEditModal(tag)
      expect(mockDialogService.open).toHaveBeenCalledOnce()
    })
  })

  describe('closeTagEditModal()', () => {
    it('closes the dialog ref when one is open', () => {
      service.openTagEditModal(tag)
      service.closeTagEditModal()
      expect(mockDialogRef.close).toHaveBeenCalled()
    })

    it('does nothing when no dialog has been opened', () => {
      expect(() => service.closeTagEditModal()).not.toThrow()
    })
  })
})

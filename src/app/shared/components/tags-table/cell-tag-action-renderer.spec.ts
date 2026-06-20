import { ComponentFixture, TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { CellTagActionRenderer } from './cell-tag-action-renderer'
import { TagsService } from '@services/tags/tags-service'
import { TagModalService } from '@services/tags/tag-modal-service'
import { provideAllIcons } from '@core/utils/provide-all-icons'

const mockContext = vi.hoisted(() => ({
  row: {
    original: { name: 'javascript', count: 42 },
  },
}))

vi.mock('@tanstack/angular-table', () => ({
  injectFlexRenderContext: () => mockContext,
}))

describe('CellTagActionRenderer', () => {
  let component: CellTagActionRenderer
  let fixture: ComponentFixture<CellTagActionRenderer>
  let mockTagsService: { deleteTag: ReturnType<typeof vi.fn> }
  let mockTagModalService: { openTagEditModal: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    mockTagsService = { deleteTag: vi.fn().mockResolvedValue(undefined) }
    mockTagModalService = { openTagEditModal: vi.fn() }

    await TestBed.configureTestingModule({
      imports: [CellTagActionRenderer],
      providers: [
        provideAllIcons,
        { provide: TagsService, useValue: mockTagsService },
        { provide: TagModalService, useValue: mockTagModalService },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(CellTagActionRenderer)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('exposes the tag from row context', () => {
    expect(component.tag).toEqual({ name: 'javascript', count: 42 })
  })

  it('openEditModal() delegates to tagModalService.openTagEditModal', () => {
    component.openEditModal()
    expect(mockTagModalService.openTagEditModal).toHaveBeenCalledWith({ name: 'javascript', count: 42 })
  })

  it('deleteTag() calls tagsService.deleteTag with the tag name', async () => {
    const mockCtx = { close: vi.fn() }
    await component.deleteTag(mockCtx)
    expect(mockTagsService.deleteTag).toHaveBeenCalledWith('javascript')
  })

  it('deleteTag() closes the dialog after deleting', async () => {
    const mockCtx = { close: vi.fn() }
    await component.deleteTag(mockCtx)
    expect(mockCtx.close).toHaveBeenCalled()
  })
})

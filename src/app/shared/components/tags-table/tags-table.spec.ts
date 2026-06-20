import { ComponentFixture, TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TagsTable } from './tags-table'
import { TagModalService } from '@services/tags/tag-modal-service'
import { provideAllIcons } from '@core/utils/provide-all-icons'
import { TagVM } from '@data-providers/abstract/models/abstract-view.model'

function makeTag(overrides: Partial<TagVM> = {}): TagVM {
  return { name: 'javascript', count: 42, ...overrides }
}

describe('TagsTable', () => {
  let component: TagsTable
  let fixture: ComponentFixture<TagsTable>
  let mockTagModalService: { openTagEditModal: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    mockTagModalService = { openTagEditModal: vi.fn() }

    await TestBed.configureTestingModule({
      imports: [TagsTable],
      providers: [provideAllIcons, { provide: TagModalService, useValue: mockTagModalService }],
    }).compileComponents()

    fixture = TestBed.createComponent(TagsTable)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('renders with an empty tags input', () => {
    fixture.componentRef.setInput('tags', [])
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('renders with a populated tags input', () => {
    const tags = [makeTag(), makeTag({ name: 'typescript', count: 17 })]
    fixture.componentRef.setInput('tags', tags)
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('openEditModal() delegates to tagModalService.openTagEditModal', () => {
    const tag = makeTag()
    component.openEditModal(tag)
    expect(mockTagModalService.openTagEditModal).toHaveBeenCalledWith(tag)
  })
})

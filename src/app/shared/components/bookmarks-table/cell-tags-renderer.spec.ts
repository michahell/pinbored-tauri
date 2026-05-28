import { ComponentFixture, TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { CellTagsRenderer } from './cell-tags-renderer'
import { provideAllIcons } from '../../core/utils/provide-all-icons'

const mockContext = vi.hoisted(() => ({
  cell: { getValue: vi.fn().mockReturnValue(['alpha', 'beta', 'gamma']) },
}))

vi.mock('@tanstack/angular-table', () => ({
  injectFlexRenderContext: () => mockContext,
}))

describe('CellTagsRenderer', () => {
  let component: CellTagsRenderer
  let fixture: ComponentFixture<CellTagsRenderer>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellTagsRenderer],
      providers: [provideAllIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(CellTagsRenderer)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('reads tags from the cell context', () => {
    expect(component.tags).toEqual(['alpha', 'beta', 'gamma'])
  })

  it('renders a badge for each tag', () => {
    fixture.detectChanges()
    const badges = fixture.nativeElement.querySelectorAll('hlm-badge')
    expect(badges.length).toBe(3)
  })
})

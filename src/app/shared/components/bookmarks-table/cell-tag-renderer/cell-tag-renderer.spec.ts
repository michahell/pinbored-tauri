import { ComponentFixture, TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { CellTagRenderer } from './cell-tag-renderer'
import { provideAllIcons } from '../../../core/provide-all-icons'

const mockContext = vi.hoisted(() => ({
  cell: { getValue: vi.fn().mockReturnValue('unchecked') },
}))

vi.mock('@tanstack/angular-table', () => ({
  injectFlexRenderContext: () => mockContext,
}))

describe('CellTagRenderer', () => {
  let component: CellTagRenderer
  let fixture: ComponentFixture<CellTagRenderer>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellTagRenderer],
      providers: [provideAllIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(CellTagRenderer)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('returns empty string for unknown status', () => {
    fixture.componentRef.setInput('status', 'unknown')
    expect(component.color()).toBe('')
  })

  it('returns a class for "stale" status', () => {
    fixture.componentRef.setInput('status', 'stale')
    expect(component.color()).toBeTruthy()
  })

  it('returns a class for "ok" status', () => {
    fixture.componentRef.setInput('status', 'ok')
    expect(component.color()).toBeTruthy()
  })

  it('returns a class for "checking" status', () => {
    fixture.componentRef.setInput('status', 'checking')
    expect(component.color()).toBeTruthy()
  })

  it('returns a class for "maybe-stale" status', () => {
    fixture.componentRef.setInput('status', 'maybe-stale')
    expect(component.color()).toBeTruthy()
  })
})

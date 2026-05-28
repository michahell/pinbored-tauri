import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { signal } from '@angular/core'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { CellBookmark } from './cell-bookmark'
import { provideAllIcons } from '../../../core/utils/provide-all-icons'
import { CommonSignalsService } from '../../../core/common-signals/common-signals-service'

const mockContext = vi.hoisted(() => ({
  row: {
    original: {
      description: 'Test Bookmark',
      href: 'https://example.com',
      tags: 'dev tools',
      tagsList: ['dev', 'tools'],
    },
  },
}))

vi.mock('@tanstack/angular-table', () => ({
  injectFlexRenderContext: () => mockContext,
}))

describe('CellBookmark', () => {
  let component: CellBookmark
  let fixture: ComponentFixture<CellBookmark>

  beforeEach(async () => {
    const mockCommonSignalsService = {
      breakpoints: { desktop: signal(false) },
    }

    await TestBed.configureTestingModule({
      imports: [CellBookmark],
      providers: [
        provideRouter([]),
        provideAllIcons,
        { provide: CommonSignalsService, useValue: mockCommonSignalsService },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(CellBookmark)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('exposes the flex render context', () => {
    expect(component.context).toBe(mockContext)
  })

  it('renders the bookmark description and href', () => {
    fixture.detectChanges()
    const text = fixture.nativeElement.textContent
    expect(text).toContain('Test Bookmark')
    expect(text).toContain('https://example.com')
  })

  it('renders a badge for each tag', () => {
    fixture.detectChanges()
    const badges = fixture.nativeElement.querySelectorAll('[hlmbadge]')
    expect(badges.length).toBe(2)
  })
})

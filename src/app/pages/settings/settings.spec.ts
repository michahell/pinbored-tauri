import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Settings from './settings'
import { provideAllIcons } from '../../shared/core/utils/provide-all-icons'

vi.mock('@signality/core', () => ({
  storage: vi.fn().mockReturnValue(Object.assign(() => '', { set: vi.fn(), update: vi.fn() })),
  mediaQuery: vi.fn().mockReturnValue(() => false),
  interval: vi.fn().mockReturnValue(null),
}))

describe('Settings', () => {
  let component: Settings
  let fixture: ComponentFixture<Settings>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [provideAllIcons, provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Settings)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

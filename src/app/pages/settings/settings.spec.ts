import { ComponentFixture, TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Settings from './settings'
import { provideAllIcons } from '../../utils/provide-all-icons'

vi.mock('@signality/core', () => ({
  mediaQuery: vi.fn().mockReturnValue(() => false),
}))

describe('Settings', () => {
  let component: Settings
  let fixture: ComponentFixture<Settings>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [provideAllIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(Settings)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

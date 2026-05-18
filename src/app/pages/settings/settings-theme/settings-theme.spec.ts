import { ComponentFixture, TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import SettingsTheme from './settings-theme'
import { SettingsService } from '../../../settings-service'

describe('SettingsTheme', () => {
  let component: SettingsTheme
  let fixture: ComponentFixture<SettingsTheme>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsTheme],
      providers: [
        {
          provide: SettingsService,
          useValue: {
            setTheme: vi.fn(),
            prefersDark: () => false,
            prefersLight: () => false,
            colorschemePreference: () => 'system',
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SettingsTheme)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

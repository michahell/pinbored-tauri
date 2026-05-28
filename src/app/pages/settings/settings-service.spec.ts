import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { SettingsService } from './settings-service'

vi.mock('@signality/core', () => ({
  mediaQuery: vi.fn().mockReturnValue(() => false),
}))

describe('SettingsService', () => {
  let service: SettingsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SettingsService)
    document.documentElement.classList.remove('dark', 'light')
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('setTheme()', () => {
    it('"dark" adds "dark" class to documentElement', () => {
      service.setTheme('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('"dark" removes "light" class from documentElement', () => {
      document.documentElement.classList.add('light')
      service.setTheme('dark')
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })

    it('"light" adds "light" class to documentElement', () => {
      service.setTheme('light')
      expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    it('"light" removes "dark" class from documentElement', () => {
      document.documentElement.classList.add('dark')
      service.setTheme('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('"system" applies dark theme when colorschemePreference is "dark"', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(service as any).systemColorschemePreference = () => 'dark'
      service.setTheme('system')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('"system" applies light theme when colorschemePreference is "light"', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(service as any).systemColorschemePreference = () => 'light'
      service.setTheme('system')
      expect(document.documentElement.classList.contains('light')).toBe(true)
    })
  })
})

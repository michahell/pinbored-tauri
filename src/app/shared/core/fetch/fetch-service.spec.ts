import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { FetchService } from './fetch-service'
import { ProgressBarService } from '@services/progress-bar/progress-bar-service'

const mockTauriFetch = vi.hoisted(() => vi.fn())

vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: mockTauriFetch,
}))

describe('FetchService', () => {
  let service: FetchService
  let mockProgressBar: {
    start: ReturnType<typeof vi.fn>
    stop: ReturnType<typeof vi.fn>
    complete: ReturnType<typeof vi.fn>
    increment: ReturnType<typeof vi.fn>
    disable: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockProgressBar = {
      start: vi.fn(),
      stop: vi.fn(),
      complete: vi.fn(),
      increment: vi.fn(),
      disable: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [FetchService, { provide: ProgressBarService, useValue: mockProgressBar }],
    })
    service = TestBed.inject(FetchService)
    mockTauriFetch.mockReset()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('fetch()', () => {
    it('starts the top progress bar before making the request', async () => {
      mockTauriFetch.mockResolvedValue({ ok: true, status: 200 })

      await service.fetch('https://example.com')

      expect(mockProgressBar.start).toHaveBeenCalledWith('topProgress')
    })

    it('completes the top progress bar on a successful response', async () => {
      mockTauriFetch.mockResolvedValue({ ok: true, status: 200 })

      await service.fetch('https://example.com')

      expect(mockProgressBar.complete).toHaveBeenCalledWith('topProgress')
    })

    it('resolves with the response from Tauri fetch', async () => {
      const fakeResponse = { ok: true, status: 200 }
      mockTauriFetch.mockResolvedValue(fakeResponse)

      const result = await service.fetch('https://example.com')

      expect(result).toBe(fakeResponse)
    })

    it('forwards input URL and init options to Tauri fetch', async () => {
      mockTauriFetch.mockResolvedValue({ ok: true, status: 200 })
      const init: RequestInit = { method: 'POST', body: 'data' }

      await service.fetch('https://example.com', init)

      expect(mockTauriFetch).toHaveBeenCalledWith('https://example.com', init)
    })

    it('stops the top progress bar when Tauri fetch throws', async () => {
      mockTauriFetch.mockRejectedValue(new Error('Network error'))

      await expect(service.fetch('https://example.com')).rejects.toThrow('Network error')

      expect(mockProgressBar.stop).toHaveBeenCalledWith('topProgress')
    })

    it('rejects with the original error when Tauri fetch throws', async () => {
      const error = new Error('Connection refused')
      mockTauriFetch.mockRejectedValue(error)

      await expect(service.fetch('https://example.com')).rejects.toBe(error)
    })

    it('does not call complete when Tauri fetch throws', async () => {
      mockTauriFetch.mockRejectedValue(new Error('fail'))

      await expect(service.fetch('https://example.com')).rejects.toThrow()

      expect(mockProgressBar.complete).not.toHaveBeenCalled()
    })

    it('does not call stop on a successful response', async () => {
      mockTauriFetch.mockResolvedValue({ ok: true, status: 200 })

      await service.fetch('https://example.com')

      expect(mockProgressBar.stop).not.toHaveBeenCalled()
    })
  })
})

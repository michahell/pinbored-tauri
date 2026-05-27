import { beforeEach, describe, vi } from 'vitest'
import { CommonSignalsService } from '@core/common-signals/common-signals-service'
import { TestBed } from '@angular/core/testing'

describe('CommonSignalsService', () => {
  let service: CommonSignalsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(CommonSignalsService)
    vi.clearAllMocks()
  })

  describe('constructs', () => {
    it('Should create an instance', () => {
      expect(service).not.toBeUndefined()
    })
  })
})

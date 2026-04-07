import { TestBed } from '@angular/core/testing'

import { StaleCheckerService } from './stale-checker-service'

describe('StaleChecker', () => {
  let service: StaleCheckerService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(StaleCheckerService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

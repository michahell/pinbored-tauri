import { TestBed } from '@angular/core/testing'

import { StaleChecker } from './stale-checker'

describe('StaleChecker', () => {
  let service: StaleChecker

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(StaleChecker)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

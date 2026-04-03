import { TestBed } from '@angular/core/testing'

import { Pinboard } from './pinboard'

describe('Pinboard', () => {
  let service: Pinboard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(Pinboard)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

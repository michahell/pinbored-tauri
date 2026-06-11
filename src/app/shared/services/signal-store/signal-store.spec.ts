import { TestBed } from '@angular/core/testing'

import { SignalStore } from './signal-store'

describe('SignalStore', () => {
  let service: SignalStore

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SignalStore)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

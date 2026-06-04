import { TestBed } from '@angular/core/testing'

import { DataProviderFacade } from './data-provider-facade'

describe('DataProvider', () => {
  let service: DataProviderFacade

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(DataProviderFacade)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

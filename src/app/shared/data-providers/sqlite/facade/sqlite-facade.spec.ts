import { TestBed } from '@angular/core/testing'

import { SqliteFacade } from './sqlite-facade'

describe('SqliteFacade', () => {
  let service: SqliteFacade

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SqliteFacade)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

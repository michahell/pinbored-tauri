import { TestBed } from '@angular/core/testing'

import { SqliteInterface } from './sqlite-interface'

describe('SqliteInterface', () => {
  let service: SqliteInterface

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SqliteInterface)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

import { TestBed } from '@angular/core/testing'
import { PinboardImporterService } from './pinboard-importer-service'

describe('PinboardImporterService', () => {
  let service: PinboardImporterService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(PinboardImporterService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

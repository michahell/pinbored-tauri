import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StaleTable } from './stale-table'

describe('StaleTable', () => {
  let component: StaleTable
  let fixture: ComponentFixture<StaleTable>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaleTable],
    }).compileComponents()

    fixture = TestBed.createComponent(StaleTable)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

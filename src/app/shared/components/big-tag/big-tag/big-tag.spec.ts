import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BigTag } from './big-tag'

describe('BigTag', () => {
  let component: BigTag
  let fixture: ComponentFixture<BigTag>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigTag],
    }).compileComponents()

    fixture = TestBed.createComponent(BigTag)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

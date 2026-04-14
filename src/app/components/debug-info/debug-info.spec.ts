import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DebugInfo } from './debug-info'

describe('DebugInfo', () => {
  let component: DebugInfo
  let fixture: ComponentFixture<DebugInfo>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugInfo],
    }).compileComponents()

    fixture = TestBed.createComponent(DebugInfo)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

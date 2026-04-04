import { ComponentFixture, TestBed } from '@angular/core/testing'
import Stale from './stale'

describe('Stale', () => {
  let component: Stale
  let fixture: ComponentFixture<Stale>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stale],
    }).compileComponents()

    fixture = TestBed.createComponent(Stale)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

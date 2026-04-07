import { ComponentFixture, TestBed } from '@angular/core/testing'
import Bookmark from './bookmark'

describe('Bookmark', () => {
  let component: Bookmark
  let fixture: ComponentFixture<Bookmark>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bookmark],
    }).compileComponents()

    fixture = TestBed.createComponent(Bookmark)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

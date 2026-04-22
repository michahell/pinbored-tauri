import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import Tag from './tag'

describe('Tag', () => {
  let component: Tag
  let fixture: ComponentFixture<Tag>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tag],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Tag)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

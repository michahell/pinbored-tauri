import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { describe, it, expect, beforeEach } from 'vitest'
import Bookmark from './bookmark'
import { provideAllIcons } from '../../shared/utils/provide-all-icons'

describe('Bookmark', () => {
  let component: Bookmark
  let fixture: ComponentFixture<Bookmark>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bookmark],
      providers: [provideAllIcons, provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Bookmark)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

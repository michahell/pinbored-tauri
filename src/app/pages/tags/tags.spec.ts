import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { describe, it, expect, beforeEach } from 'vitest'
import Tags from './tags'
import { provideAllIcons } from '../../shared/utils/provide-all-icons'

describe('Tags', () => {
  let component: Tags
  let fixture: ComponentFixture<Tags>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tags],
      providers: [provideAllIcons, provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Tags)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

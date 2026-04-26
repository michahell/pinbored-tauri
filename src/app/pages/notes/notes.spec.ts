import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { describe, it, expect, beforeEach } from 'vitest'
import Notes from './notes'
import { provideAllIcons } from '../../shared/utils/provide-all-icons'

describe('Notes', () => {
  let component: Notes
  let fixture: ComponentFixture<Notes>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notes],
      providers: [provideAllIcons, provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Notes)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { describe, it, expect, beforeEach } from 'vitest'
import { Breadcrumbs } from './breadcrumbs'
import { provideAllIcons } from '../../utils/provide-all-icons'

describe('Breadcrumbs', () => {
  let component: Breadcrumbs
  let fixture: ComponentFixture<Breadcrumbs>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumbs],
      providers: [provideRouter([]), provideAllIcons],
    }).compileComponents()

    fixture = TestBed.createComponent(Breadcrumbs)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('renders a nav element', () => {
    fixture.detectChanges()
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav')
    expect(nav).toBeTruthy()
  })

  it('renders breadcrumb link items', () => {
    fixture.detectChanges()
    const links: NodeList = fixture.nativeElement.querySelectorAll('a')
    expect(links.length).toBeGreaterThan(0)
  })
})

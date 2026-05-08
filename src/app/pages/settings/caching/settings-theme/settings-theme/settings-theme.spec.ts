import { ComponentFixture, TestBed } from '@angular/core/testing'
import SettingsTheme from './settings-theme'

describe('SettingsTheme', () => {
  let component: SettingsTheme
  let fixture: ComponentFixture<SettingsTheme>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsTheme],
    }).compileComponents()

    fixture = TestBed.createComponent(SettingsTheme)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

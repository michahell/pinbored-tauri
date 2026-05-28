import { ComponentFixture, TestBed } from '@angular/core/testing'
import SettingsShortcuts from './settings-shortcuts'

describe('SettingsCaching', () => {
  let component: SettingsShortcuts
  let fixture: ComponentFixture<SettingsShortcuts>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsShortcuts],
    }).compileComponents()

    fixture = TestBed.createComponent(SettingsShortcuts)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

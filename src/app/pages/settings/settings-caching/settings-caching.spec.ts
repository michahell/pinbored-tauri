import { ComponentFixture, TestBed } from '@angular/core/testing'
import SettingsCaching from './settings-caching'

describe('SettingsCaching', () => {
  let component: SettingsCaching
  let fixture: ComponentFixture<SettingsCaching>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsCaching],
    }).compileComponents()

    fixture = TestBed.createComponent(SettingsCaching)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

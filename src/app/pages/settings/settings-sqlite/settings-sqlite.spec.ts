import { ComponentFixture, TestBed } from '@angular/core/testing'
import SettingsSqlite from './settings-sqlite'

describe('SettingsSqlite', () => {
  let component: SettingsSqlite
  let fixture: ComponentFixture<SettingsSqlite>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsSqlite],
    }).compileComponents()

    fixture = TestBed.createComponent(SettingsSqlite)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})

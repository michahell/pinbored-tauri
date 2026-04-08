import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { signal } from '@angular/core'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { App } from './app'
import { AuthenticationService } from './services/authentication/authentication-service'
import { provideAllIcons } from './utils/provide-all-icons'

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue(''),
}))

vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: vi.fn(),
}))

vi.mock('@tauri-apps/plugin-store', () => ({
  load: vi.fn().mockResolvedValue({ get: vi.fn(), set: vi.fn(), save: vi.fn() }),
}))

vi.mock('@signality/core', () => ({
  storage: vi.fn().mockReturnValue(Object.assign(() => '', { set: vi.fn(), update: vi.fn() })),
  mediaQuery: vi.fn().mockReturnValue(() => false),
  interval: vi.fn().mockReturnValue(null),
}))

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideAllIcons,
        {
          provide: AuthenticationService,
          useValue: {
            authStatus: signal('unauthenticated'),
            authenticate: vi.fn().mockResolvedValue(false),
            logout: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })
})

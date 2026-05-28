import { ComponentFixture, TestBed } from '@angular/core/testing'
import { signal } from '@angular/core'
import { Router, provideRouter } from '@angular/router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Menu } from './menu'
import { AuthenticationService } from '@auth/authentication-service'
import { provideAllIcons } from '@core/utils/provide-all-icons'

describe('Menu', () => {
  let component: Menu
  let fixture: ComponentFixture<Menu>
  let authStatusSignal: ReturnType<typeof signal<'checking' | 'unauthenticated' | 'authenticated'>>
  let mockAuth: { authStatus: typeof authStatusSignal; logout: ReturnType<typeof vi.fn> }
  let router: Router

  beforeEach(async () => {
    authStatusSignal = signal<'checking' | 'unauthenticated' | 'authenticated'>('checking')
    mockAuth = {
      authStatus: authStatusSignal,
      logout: vi.fn().mockResolvedValue(undefined),
    }

    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [provideRouter([]), provideAllIcons, { provide: AuthenticationService, useValue: mockAuth }],
    }).compileComponents()

    router = TestBed.inject(Router)
    vi.spyOn(router, 'navigate').mockResolvedValue(true)

    fixture = TestBed.createComponent(Menu)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('isLoggedIn', () => {
    it('is true when authStatus is "authenticated"', () => {
      authStatusSignal.set('authenticated')
      expect(component.isLoggedIn()).toBe(true)
    })

    it('is false when authStatus is "unauthenticated"', () => {
      authStatusSignal.set('unauthenticated')
      expect(component.isLoggedIn()).toBe(false)
    })

    it('is false when authStatus is "checking"', () => {
      authStatusSignal.set('checking')
      expect(component.isLoggedIn()).toBe(false)
    })
  })

  describe('logout()', () => {
    it('calls authentication.logout()', async () => {
      await component.logout()
      expect(mockAuth.logout).toHaveBeenCalled()
    })

    it('navigates to /login after logout', async () => {
      await component.logout()
      expect(router.navigate).toHaveBeenCalledWith(['/login'])
    })
  })
})

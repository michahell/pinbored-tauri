import { ComponentFixture, TestBed } from '@angular/core/testing'
import { signal } from '@angular/core'
import { Router } from '@angular/router'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Login from './login'
import { AuthenticationService } from '../../services/authentication/authentication-service'
import { provideAllIcons } from '../../utils/provide-all-icons'

describe('Login', () => {
  let component: Login
  let fixture: ComponentFixture<Login>
  let authStatusSignal: ReturnType<typeof signal<'checking' | 'unauthenticated' | 'authenticated'>>
  let mockAuth: { authStatus: typeof authStatusSignal; authenticate: ReturnType<typeof vi.fn> }
  let mockRouter: { navigate: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    authStatusSignal = signal<'checking' | 'unauthenticated' | 'authenticated'>('checking')
    mockAuth = {
      authStatus: authStatusSignal,
      authenticate: vi.fn().mockImplementation(async () => {
        authStatusSignal.set('unauthenticated')
        return false
      }),
    }
    mockRouter = { navigate: vi.fn().mockResolvedValue(true) }

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideAllIcons,
        { provide: AuthenticationService, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(Login)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('authStatus reflects the injected service status', () => {
    authStatusSignal.set('unauthenticated')
    expect(component.authStatus()).toBe('unauthenticated')
  })

  describe('ngOnInit()', () => {
    it('calls authenticate() on init', async () => {
      // authenticate was already called during fixture creation (whenStable)
      expect(mockAuth.authenticate).toHaveBeenCalled()
    })

    it('navigates to /bookmarks if already authenticated', async () => {
      mockAuth.authenticate.mockImplementation(async () => {
        authStatusSignal.set('authenticated')
        return true
      })

      await component.ngOnInit()

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bookmarks'])
    })

    it('does not navigate when not authenticated', async () => {
      mockAuth.authenticate.mockImplementation(async () => {
        authStatusSignal.set('unauthenticated')
        return false
      })

      mockRouter.navigate.mockClear()
      await component.ngOnInit()

      // May navigate but with non-bookmarks route or not at all
      const calls = mockRouter.navigate.mock.calls
      const navigatedToBookmarks = calls.some(([route]) => route[0] === '/bookmarks')
      expect(navigatedToBookmarks).toBe(false)
    })
  })

  describe('login()', () => {
    it('calls authenticate with form username and token', async () => {
      component.loginForm.controls.username.setValue('michael')
      component.loginForm.controls.token.setValue('mytoken')
      mockAuth.authenticate.mockClear()

      await component.login()

      expect(mockAuth.authenticate).toHaveBeenCalledWith({ username: 'michael', token: 'mytoken' })
    })

    it('navigates to /bookmarks when authentication succeeds', async () => {
      component.loginForm.controls.username.setValue('michael')
      component.loginForm.controls.token.setValue('mytoken')
      mockAuth.authenticate.mockImplementation(async () => {
        authStatusSignal.set('authenticated')
        return true
      })

      await component.login()

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bookmarks'])
    })

    it('sets form errors when username and token are null', async () => {
      component.loginForm.controls.username.setValue(null)
      component.loginForm.controls.token.setValue(null)

      await component.login()

      expect(component.loginForm.errors).toEqual({ unauthenticated: { means: 'bad' } })
    })

    it('does not call authenticate when form values are null', async () => {
      component.loginForm.controls.username.setValue(null)
      component.loginForm.controls.token.setValue(null)
      mockAuth.authenticate.mockClear()

      await component.login()

      expect(mockAuth.authenticate).not.toHaveBeenCalled()
    })
  })
})

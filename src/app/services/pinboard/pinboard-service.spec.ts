import { TestBed } from '@angular/core/testing'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { PinboardService } from './pinboard-service'

const mockFetch = vi.fn()

vi.mock('@tauri-apps/plugin-http', () => ({
  fetch: mockFetch,
}))

function mockResponse(data: unknown) {
  return Promise.resolve({ json: () => Promise.resolve(data) })
}

describe('Pinboard', () => {
  let service: PinboardService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(PinboardService)
    service.storedUsername = 'testuser'
    service.storedToken = 'testtoken'
    mockFetch.mockReset()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('auth guard', () => {
    const methods: Array<() => Promise<unknown>> = []

    beforeEach(() => {
      service.storedUsername = ''
      service.storedToken = ''
    })

    it('getLastUpdateTime throws when auth not set', () => {
      expect(() => service.getLastUpdateTime()).toThrow('auth not set!')
    })

    it('addBookmark throws when auth not set', () => {
      expect(() => service.addBookmark('https://example.com', 'Example')).toThrow('auth not set!')
    })

    it('deleteBookmark throws when auth not set', () => {
      expect(() => service.deleteBookmark('https://example.com')).toThrow('auth not set!')
    })

    it('getBookmarks throws when auth not set', () => {
      expect(() => service.getBookmarks()).toThrow('auth not set!')
    })

    it('getRecentBookmarks throws when auth not set', () => {
      expect(() => service.getRecentBookmarks()).toThrow('auth not set!')
    })

    it('getBookmarkDates throws when auth not set', () => {
      expect(() => service.getBookmarkDates()).toThrow('auth not set!')
    })

    it('getAllBookmarks throws when auth not set', () => {
      expect(() => service.getAllBookmarks()).toThrow('auth not set!')
    })

    it('suggestTagsForUrl throws when auth not set', () => {
      expect(() => service.suggestTagsForUrl('https://example.com')).toThrow('auth not set!')
    })

    it('getAllTags throws when auth not set', () => {
      expect(() => service.getAllTags()).toThrow('auth not set!')
    })

    it('deleteTag throws when auth not set', () => {
      expect(() => service.deleteTag('mytag')).toThrow('auth not set!')
    })

    it('renameTag throws when auth not set', () => {
      expect(() => service.renameTag('old', 'new')).toThrow('auth not set!')
    })

    it('getUserSecret throws when auth not set', () => {
      expect(() => service.getUserSecret()).toThrow('auth not set!')
    })

    it('getUserApiToken throws when auth not set', () => {
      expect(() => service.getUserApiToken()).toThrow('auth not set!')
    })

    it('getNotesList throws when auth not set', () => {
      expect(() => service.getNotesList()).toThrow('auth not set!')
    })

    it('getNote throws when auth not set', () => {
      expect(() => service.getNote('abc123')).toThrow('auth not set!')
    })
  })

  describe('getLastUpdateTime', () => {
    it('calls posts/update and returns update time', async () => {
      const mockData = { update_time: '2024-01-01T00:00:00Z' }
      mockFetch.mockReturnValue(mockResponse(mockData))

      const result = await service.getLastUpdateTime()

      expect(mockFetch).toHaveBeenCalledOnce()
      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/posts/update')
      expect(url).toContain('auth_token=testuser%3Atesttoken')
      expect(result).toEqual(mockData)
    })
  })

  describe('addBookmark', () => {
    it('calls posts/add with required params', async () => {
      mockFetch.mockReturnValue(mockResponse({ result_code: 'done' }))

      await service.addBookmark('https://example.com', 'Example Site')

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/posts/add')
      expect(url).toContain('url=https%3A%2F%2Fexample.com')
      expect(url).toContain('description=Example+Site')
    })

    it('includes optional params when provided', async () => {
      mockFetch.mockReturnValue(mockResponse({ result_code: 'done' }))

      await service.addBookmark('https://example.com', 'Example', {
        tags: 'dev tools',
        shared: 'no',
        toread: 'yes',
        replace: 'yes',
        extended: 'Some notes',
      })

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('tags=dev+tools')
      expect(url).toContain('shared=no')
      expect(url).toContain('toread=yes')
      expect(url).toContain('replace=yes')
      expect(url).toContain('extended=Some+notes')
    })

    it('returns result_code', async () => {
      mockFetch.mockReturnValue(mockResponse({ result_code: 'done' }))

      const result = await service.addBookmark('https://example.com', 'Example')

      expect(result).toEqual({ result_code: 'done' })
    })
  })

  describe('deleteBookmark', () => {
    it('calls posts/delete with the url param', async () => {
      mockFetch.mockReturnValue(mockResponse({ result_code: 'done' }))

      const result = await service.deleteBookmark('https://example.com')

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/posts/delete')
      expect(url).toContain('url=https%3A%2F%2Fexample.com')
      expect(result).toEqual({ result_code: 'done' })
    })
  })

  describe('getBookmarks', () => {
    it('calls posts/get without options', async () => {
      const mockData = { date: '2024-01-01', user: 'testuser', posts: [] }
      mockFetch.mockReturnValue(mockResponse(mockData))

      const result = await service.getBookmarks()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/posts/get')
      expect(result).toEqual(mockData)
    })

    it('appends tag, dt, url and meta params when provided', async () => {
      mockFetch.mockReturnValue(mockResponse({ date: '', user: '', posts: [] }))

      await service.getBookmarks({ tag: ['dev', 'tools'], dt: '2024-01-01', meta: 'yes' })

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('tag=dev')
      expect(url).toContain('tag=tools')
      expect(url).toContain('dt=2024-01-01')
      expect(url).toContain('meta=yes')
    })

    it('limits tag array to 3 entries', async () => {
      mockFetch.mockReturnValue(mockResponse({ date: '', user: '', posts: [] }))

      await service.getBookmarks({ tag: ['a', 'b', 'c', 'd'] })

      const [url] = mockFetch.mock.calls[0]
      const tagMatches = [...url.matchAll(/tag=/g)]
      expect(tagMatches.length).toBe(3)
    })
  })

  describe('getRecentBookmarks', () => {
    it('calls posts/recent without options', async () => {
      const mockData = { date: '2024-01-01', user: 'testuser', posts: [] }
      mockFetch.mockReturnValue(mockResponse(mockData))

      const result = await service.getRecentBookmarks()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/posts/recent')
      expect(result).toEqual(mockData)
    })

    it('appends count param when provided', async () => {
      mockFetch.mockReturnValue(mockResponse({ date: '', user: '', posts: [] }))

      await service.getRecentBookmarks({ count: 25 })

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('count=25')
    })
  })

  describe('getBookmarkDates', () => {
    it('calls posts/dates without tags', async () => {
      const mockData = { user: 'testuser', tag: '', dates: { '2024-01-01': '5' } }
      mockFetch.mockReturnValue(mockResponse(mockData))

      const result = await service.getBookmarkDates()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/posts/dates')
      expect(result).toEqual(mockData)
    })

    it('appends tag params when provided as array', async () => {
      mockFetch.mockReturnValue(mockResponse({ user: '', tag: '', dates: {} }))

      await service.getBookmarkDates(['dev', 'tools'])

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('tag=dev')
      expect(url).toContain('tag=tools')
    })

    it('appends a single tag when provided as string', async () => {
      mockFetch.mockReturnValue(mockResponse({ user: '', tag: '', dates: {} }))

      await service.getBookmarkDates('dev')

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('tag=dev')
    })
  })

  describe('getAllBookmarks', () => {
    it('calls posts/all without options', async () => {
      const mockData = [{ href: 'https://example.com', description: 'Example' }]
      mockFetch.mockReturnValue(mockResponse(mockData))

      const result = await service.getAllBookmarks()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/posts/all')
      expect(result).toEqual(mockData)
    })

    it('appends optional params when provided', async () => {
      mockFetch.mockReturnValue(mockResponse([]))

      await service.getAllBookmarks({
        tag: 'dev',
        start: 10,
        results: 50,
        fromdt: '2024-01-01T00:00:00Z',
        todt: '2024-12-31T23:59:59Z',
        meta: 1,
      })

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('tag=dev')
      expect(url).toContain('start=10')
      expect(url).toContain('results=50')
      expect(url).toContain('fromdt=')
      expect(url).toContain('todt=')
      expect(url).toContain('meta=1')
    })
  })

  describe('suggestTagsForUrl', () => {
    it('calls posts/suggest with the url param', async () => {
      const mockData: [{ popular: string[] }, { recommended: string[] }] = [
        { popular: ['webdev', 'css'] },
        { recommended: ['design', 'frontend'] },
      ]
      mockFetch.mockReturnValue(mockResponse(mockData))

      const result = await service.suggestTagsForUrl('https://example.com')

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/posts/suggest')
      expect(url).toContain('url=https%3A%2F%2Fexample.com')
      expect(result).toEqual(mockData)
    })
  })

  describe('getAllTags', () => {
    it('calls tags/get and returns tag map', async () => {
      const mockData = { javascript: '42', typescript: '17' }
      mockFetch.mockReturnValue(mockResponse(mockData))

      const result = await service.getAllTags()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/tags/get')
      expect(result).toEqual(mockData)
    })
  })

  describe('deleteTag', () => {
    it('calls tags/delete with the tag param', async () => {
      mockFetch.mockReturnValue(mockResponse({ result: 'done' }))

      const result = await service.deleteTag('obsolete')

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/tags/delete')
      expect(url).toContain('tag=obsolete')
      expect(result).toEqual({ result: 'done' })
    })
  })

  describe('renameTag', () => {
    it('calls tags/rename with old and new params', async () => {
      mockFetch.mockReturnValue(mockResponse({ result: 'done' }))

      const result = await service.renameTag('oldtag', 'newtag')

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/tags/rename')
      expect(url).toContain('old=oldtag')
      expect(url).toContain('new=newtag')
      expect(result).toEqual({ result: 'done' })
    })
  })

  describe('getUserSecret', () => {
    it('calls user/secret and returns result', async () => {
      mockFetch.mockReturnValue(mockResponse({ result: 'abc123secret' }))

      const result = await service.getUserSecret()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/user/secret')
      expect(result).toEqual({ result: 'abc123secret' })
    })
  })

  describe('getUserApiToken', () => {
    it('calls user/api_token and returns result', async () => {
      mockFetch.mockReturnValue(mockResponse({ result: 'user:token123' }))

      const result = await service.getUserApiToken()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/user/api_token')
      expect(result).toEqual({ result: 'user:token123' })
    })
  })

  describe('getNotesList', () => {
    it('calls notes/list and returns notes', async () => {
      const mockData = {
        count: 1,
        notes: [
          {
            id: 'note1',
            title: 'My Note',
            created_at: '2024-01-01',
            updated_at: '2024-01-02',
            length: 123,
          },
        ],
      }
      mockFetch.mockReturnValue(mockResponse(mockData))

      const result = await service.getNotesList()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/notes/list')
      expect(result).toEqual(mockData)
    })
  })

  describe('getNote', () => {
    it('calls notes/{ID} and returns note detail', async () => {
      const mockData = {
        id: 'note1',
        title: 'My Note',
        text: 'Note body text',
        hash: 'abc123',
        created_at: '2024-01-01',
        updated_at: '2024-01-02',
        length: 14,
      }
      mockFetch.mockReturnValue(mockResponse(mockData))

      const result = await service.getNote('note1')

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('/notes/note1')
      expect(result).toEqual(mockData)
    })
  })

  describe('auth token format', () => {
    it('includes auth_token as user:token in all requests', async () => {
      mockFetch.mockReturnValue(mockResponse({}))
      service.storedUsername = 'myuser'
      service.storedToken = 'mypass'

      await service.getLastUpdateTime()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('auth_token=myuser%3Amypass')
    })

    it('includes format=json in all requests', async () => {
      mockFetch.mockReturnValue(mockResponse({}))

      await service.getLastUpdateTime()

      const [url] = mockFetch.mock.calls[0]
      expect(url).toContain('format=json')
    })
  })
})

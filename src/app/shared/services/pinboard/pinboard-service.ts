import { inject, Injectable } from '@angular/core'
import { FetchService } from '../fetch/fetch-service'
import {
  PinboardDatesResult,
  PinboardItem,
  PinboardNoteDetail,
  PinboardNotesList,
  PinboardPostsResult,
  PinboardResultCode,
  PinboardSuggestResult,
  PinboardTagResult,
  PinboardTagsMap,
  PinboardUpdateResult,
  PinboardUserApiToken,
  PinboardUserSecret,
} from '@models/pinboard.model'

const PINBOARD_BASE_URL = 'https://api.pinboard.in/v1'

@Injectable({
  providedIn: 'root',
})
export class PinboardService {
  #fetchService = inject(FetchService)
  // we alias #fetch to be able to 'intercept' fetching and do things before and after
  #fetch = this.#fetchService.fetch
  // for debug issues, re-alias back to tauri fetch!
  // #fetch = fetch

  #user: string = ''
  #token: string = ''

  get storedUsername(): string {
    return this.#user
  }
  set storedUsername(value: string) {
    this.#user = value
  }

  get storedToken(): string {
    return this.#token
  }
  set storedToken(value: string) {
    this.#token = value
  }

  /** user/api_token — returns the user's API token */
  async getUserApiToken(username: string, token: string): Promise<PinboardUserApiToken> {
    const params = this.#getParams({ username, token })
    const url = `${PINBOARD_BASE_URL}/user/api_token?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** posts/update — returns the most recent time a bookmark was added, updated or deleted */
  async getLastUpdateTime(): Promise<PinboardUpdateResult> {
    this.#requireAuth()
    const params = this.#getParams()
    const url = `${PINBOARD_BASE_URL}/posts/update?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** posts/add — add a new bookmark */
  async addBookmark(
    bookmarkUrl: string,
    description: string,
    options?: {
      extended?: string
      tags?: string
      dt?: string
      replace?: 'yes' | 'no'
      shared?: 'yes' | 'no'
      toread?: 'yes' | 'no'
    }
  ): Promise<PinboardResultCode> {
    this.#requireAuth()
    const params = this.#getParams()
    params.append('url', bookmarkUrl)
    params.append('description', description)
    if (options?.extended != null) params.append('extended', options.extended)
    if (options?.tags != null) params.append('tags', options.tags)
    if (options?.dt != null) params.append('dt', options.dt)
    if (options?.replace != null) params.append('replace', options.replace)
    if (options?.shared != null) params.append('shared', options.shared)
    if (options?.toread != null) params.append('toread', options.toread)
    const url = `${PINBOARD_BASE_URL}/posts/add?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** posts/delete — delete a bookmark */
  async deleteBookmark(bookmarkUrl: string): Promise<PinboardResultCode> {
    this.#requireAuth()
    const params = this.#getParams()
    params.append('url', bookmarkUrl)
    const url = `${PINBOARD_BASE_URL}/posts/delete?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** posts/get — returns one or more posts on a single day matching the criteria */
  async getBookmarks(options?: {
    tag?: string | string[]
    dt?: string
    url?: string
    meta?: 'yes' | 'no'
  }): Promise<PinboardPostsResult> {
    this.#requireAuth()
    const params = this.#getParams()
    if (options?.tag != null) {
      const tags = Array.isArray(options.tag) ? options.tag.slice(0, 3) : [options.tag]
      tags.forEach((t) => params.append('tag', t))
    }
    if (options?.dt != null) params.append('dt', options.dt)
    if (options?.url != null) params.append('url', options.url)
    if (options?.meta != null) params.append('meta', options.meta)
    const url = `${PINBOARD_BASE_URL}/posts/get?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** posts/recent — returns the most recent bookmarks, optionally filtered by tag */
  async getRecentBookmarks(options?: { tag?: string | string[]; count?: number }): Promise<PinboardPostsResult> {
    this.#requireAuth()
    const params = this.#getParams()
    if (options?.tag != null) {
      const tags = Array.isArray(options.tag) ? options.tag.slice(0, 3) : [options.tag]
      tags.forEach((t) => params.append('tag', t))
    }
    if (options?.count != null) params.append('count', String(options.count))
    const url = `${PINBOARD_BASE_URL}/posts/recent?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** posts/dates — returns a list of dates with the number of posts at each date */
  async getBookmarkDates(tags?: string | string[]): Promise<PinboardDatesResult> {
    this.#requireAuth()
    const params = this.#getParams()
    if (tags != null) {
      const tagList = Array.isArray(tags) ? tags.slice(0, 3) : [tags]
      tagList.forEach((t) => params.append('tag', t))
    }
    const url = `${PINBOARD_BASE_URL}/posts/dates?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** posts/all — returns all bookmarks in the user's account */
  async getAllBookmarks(options?: {
    tag?: string
    start?: number
    results?: number
    fromdt?: string
    todt?: string
    meta?: number
  }): Promise<PinboardItem[]> {
    this.#requireAuth()
    const params = this.#getParams()
    if (options?.tag != null) params.append('tag', options.tag)
    if (options?.start != null) params.append('start', String(options.start))
    if (options?.results != null) params.append('results', String(options.results))
    if (options?.fromdt != null) params.append('fromdt', options.fromdt)
    if (options?.todt != null) params.append('todt', options.todt)
    if (options?.meta != null) params.append('meta', String(options.meta))
    const url = `${PINBOARD_BASE_URL}/posts/all?${params}`
    console.log('getAllPosts url: ', url)
    return this.#fetch(url, { method: 'GET', headers: {} }).then<PinboardItem[]>((response) => {
      console.log(response)
      return response.json()
    })
  }

  /** posts/suggest — returns a list of popular and recommended tags for a given URL */
  async suggestTagsForUrl(bookmarkUrl: string): Promise<PinboardSuggestResult> {
    this.#requireAuth()
    const params = this.#getParams()
    params.append('url', bookmarkUrl)
    const url = `${PINBOARD_BASE_URL}/posts/suggest?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** tags/get — returns a full list of the user's tags along with the number of times they were used */
  async getAllTags(): Promise<PinboardTagsMap> {
    this.#requireAuth()
    const params = this.#getParams()
    const url = `${PINBOARD_BASE_URL}/tags/get?${params}`
    console.log('getAllTags url: ', url)
    return this.#fetch(url, { method: 'GET' }).then((response) => {
      console.log(response)
      return response.json()
    })
  }

  /** tags/delete — delete an existing tag */
  async deleteTag(tag: string): Promise<PinboardTagResult> {
    this.#requireAuth()
    const params = this.#getParams()
    params.append('tag', tag)
    const url = `${PINBOARD_BASE_URL}/tags/delete?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** tags/rename — rename a tag */
  async renameTag(oldTag: string, newTag: string): Promise<PinboardTagResult> {
    this.#requireAuth()
    const params = this.#getParams()
    params.append('old', oldTag)
    params.append('new', newTag)
    const url = `${PINBOARD_BASE_URL}/tags/rename?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** user/secret — returns the user's secret RSS key */
  async getUserSecret(): Promise<PinboardUserSecret> {
    this.#requireAuth()
    const params = this.#getParams()
    const url = `${PINBOARD_BASE_URL}/user/secret?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** notes/list — returns a list of the user's notes */
  async getNotesList(): Promise<PinboardNotesList> {
    this.#requireAuth()
    const params = this.#getParams()
    const url = `${PINBOARD_BASE_URL}/notes/list?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  /** notes/{ID} — returns an individual user note */
  async getNote(id: string): Promise<PinboardNoteDetail> {
    this.#requireAuth()
    const params = this.#getParams()
    const url = `${PINBOARD_BASE_URL}/notes/${id}?${params}`
    return this.#fetch(url, { method: 'GET' }).then((r) => r.json())
  }

  #getParams(authentication: { username: string; token: string } | null = null) {
    const params = new URLSearchParams()
    const username = authentication?.username ?? this.storedUsername
    const token = authentication?.token ?? this.storedToken
    params.append('auth_token', `${username}:${token}`)
    params.append('format', `json`)
    return params
  }

  #requireAuth(): void {
    if (!this.#authSet()) {
      throw new Error('auth not set!')
    }
  }

  #authSet(): boolean {
    return !!this.storedUsername && !!this.storedToken
  }
}

import { Injectable } from '@angular/core'
import { fetch } from '@tauri-apps/plugin-http'
import { PinboardItem, PinboardTag } from '../../models/pinboard.model'

const PINBOARD_BASE_URL = 'https://api.pinboard.in/v1'

@Injectable({
  providedIn: 'root',
})
export class Pinboard {
  #user: string = ''
  #password: string = ''

  get user(): string {
    return this.#user
  }
  set user(value: string) {
    this.#user = value
  }

  get password(): string {
    return this.#password
  }
  set password(value: string) {
    this.#password = value
  }

  async getAllTags(): Promise<PinboardTag[]> {
    if (!this.#authSet()) {
      throw new Error('auth not set!')
    }

    const params = this.#getParams()
    const url = `${PINBOARD_BASE_URL}/tags/get?${params}`
    console.log('getAllTags url: ', url)

    return fetch(url, {
      method: 'GET',
    }).then((response) => {
      console.log(response)
      return response.json()
    })
  }

  async getAllBookmarks(): Promise<PinboardItem[]> {
    if (!this.#authSet()) {
      throw new Error('auth not set!')
    }

    const params = this.#getParams()
    const url = `${PINBOARD_BASE_URL}/posts/all?${params}`
    console.log('getAllPosts url: ', url)

    return fetch(url, {
      method: 'GET',
      headers: {},
    }).then<PinboardItem[]>((response) => {
      console.log(response)
      return response.json()
    })
  }

  #getParams() {
    const params = new URLSearchParams()
    params.append('auth_token', `${this.user}:${this.password}`)
    params.append('format', `json`)
    return params
  }

  #authSet(): boolean {
    return !!this.user && !!this.password
  }
}

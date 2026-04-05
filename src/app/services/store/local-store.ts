import { Injectable } from '@angular/core'
import { load, Store } from '@tauri-apps/plugin-store'
import { LocalStoreModel } from './local-store.model'

@Injectable({
  providedIn: 'root',
})
export class LocalStore {
  #store: Store | null = null

  async load(): Promise<void> {
    // Create a new store or load the existing one,
    // note that the options will be ignored if a `Store` with that path has already been created
    this.#store = await load('localstore.json', {
      defaults: {},
      autoSave: 100,
    })
  }

  async get<T>(key: string): Promise<T | undefined> {
    // Get a value.
    if (this.#store != null) {
      return await this.#store.get<T>(key)
    }
    return undefined
  }

  async set(key: string, value: any): Promise<void> {
    // Set a value.
    if (this.#store != null) {
      return await this.#store.set(key, value)
    }
  }

  async save(): Promise<void> {
    // You can manually save the store after making changes.
    // Otherwise, it will save upon graceful exit
    // And if you set `autoSave` to a number or left empty,
    // it will save the changes to disk after a debounce delay, 100ms by default.
    if (this.#store != null) {
      await this.#store.save()
    }
  }
}

import { Store } from 'tauri-plugin-store-api'
import { PERSISTENCE_STORE_NAME } from './constants'

export class PersistenceService {
	private store: Store

	constructor(filename: string) {
		this.store = new Store(filename)
	}

	async set(key: string, value: any): Promise<void> {
		const stringified = JSON.stringify(value)
		console.log(`setting key ${key} to value '${stringified}'`)
		return await this.store.set(key, stringified)
	}

	async get<T>(key: string): Promise<T> {
		const val = await this.store.get<string>(key)
		const parsed: T = JSON.parse(val) as T
		console.log(`got value ${parsed} for key ${key}`)
		return parsed
	}
}

const persistenceService: PersistenceService = new PersistenceService(PERSISTENCE_STORE_NAME)
export { persistenceService }

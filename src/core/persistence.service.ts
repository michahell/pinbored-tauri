import { Store } from 'tauri-plugin-store-api'
import { PERSISTENCE_STORE_NAME } from './constants'

export class PersistenceService {
	private store: Store

	constructor(filename: string) {
		this.store = new Store(filename)
	}

	async set(key: string, value: any): Promise<void> {
		console.log(`setting key ${key} to value '${value}'`)
		return await this.store.set(key, value)
	}

	async get<T>(key: string): Promise<T> {
		const val = await this.store.get<T>(key)
		console.log(`got value ${val} for key ${key}`)
		return val
	}
}

const persistenceService: PersistenceService = new PersistenceService(PERSISTENCE_STORE_NAME)
export { persistenceService }

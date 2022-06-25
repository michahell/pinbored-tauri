import { Store } from 'tauri-plugin-store-api'

export class PersistenceService {
	private store: Store

	constructor(filename: string) {
		this.store = new Store(filename)
	}

	async set(key: string, value: any) {
		console.log(`setting key ${key} to value '${value}'`)
		await this.store.set(key, value)
	}

	async get(key: string) {
		const val = await this.store.get(key)
		console.log(`got value ${val} for key ${key}`)
	}
}

const service: PersistenceService = new PersistenceService('settings.dat')
export default service

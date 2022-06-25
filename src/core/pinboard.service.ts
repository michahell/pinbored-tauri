import { fetch, ResponseType } from '@tauri-apps/api/http'
import { HEADER_PINBOARD_APP_ID, HEADER_PINBOARD_TOKEN, PINBOARD_APP_ID } from './constants'
import persistenceService from './persistence.service'

export class PinboardService {
	private defaultHeaders: Record<string, string> = {}

	private mockApiUrl: string = 'https://run.mocky.io/v3/e91c7675-60b4-4260-aa73-122a4c336a29'

	constructor(appId: string, authToken: string) {
		this.defaultHeaders[HEADER_PINBOARD_APP_ID] = appId
		this.updateAuthToken(authToken)
	}

	async updateAuthToken(authToken: string) {
		await persistenceService.set(HEADER_PINBOARD_TOKEN, authToken)
		this.defaultHeaders[HEADER_PINBOARD_TOKEN] = authToken
	}

	hasTokenPresent(): boolean {
		return this.defaultHeaders[HEADER_PINBOARD_TOKEN] !== ''
	}

	async request(url, extraOptions?) {
		if (!this.hasTokenPresent()) {
			throw new Error('no token set. use updateToken(token) to set auth token!')
		}
		const defaultOptions = {
			method: 'GET',
			timeout: 50,
			responseType: ResponseType.JSON,
			headers: this.defaultHeaders,
		}
		const options = { ...defaultOptions, ...extraOptions }
		return await fetch(url, options)
	}

	async getLinks() {
		return await this.request(this.mockApiUrl)
	}
}

const service: PinboardService = new PinboardService(PINBOARD_APP_ID, '')
export default service

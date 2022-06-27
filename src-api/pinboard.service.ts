import { fetch, ResponseType } from '@tauri-apps/api/http'
import type { PinboardLink } from './typing'
import { HEADER_PINBOARD_APP_ID, HEADER_PINBOARD_TOKEN } from './contants'

export class PinboardService {
	private defaultHeaders: Record<string, string> = {}

	private mockApiUrl: string = 'https://run.mocky.io/v3/e91c7675-60b4-4260-aa73-122a4c336a29'

	constructor() {}

	setAuthToken(authToken: string) {
		this.defaultHeaders[HEADER_PINBOARD_TOKEN] = authToken
	}

	setAppId(appId: string) {
		this.defaultHeaders[HEADER_PINBOARD_APP_ID] = appId
	}

	hasTokenPresent(): boolean {
		return this.defaultHeaders[HEADER_PINBOARD_TOKEN] !== ''
	}

	async request<T>(url, extraOptions?) {
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
		return await fetch<T>(url, options)
	}

	async getLinks(): Promise<PinboardLink[]> {
		const { data } = await this.request<PinboardLink[]>(this.mockApiUrl)
		return data
	}
}

const pinboardService = new PinboardService()
export default pinboardService

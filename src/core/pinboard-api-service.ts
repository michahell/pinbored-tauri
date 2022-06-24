import { fetch, ResponseType } from '@tauri-apps/api/http'

export class PinboardApiService {
	private defaultHeaders: Record<string, string> = {
		'X-App-ID': 'pinbored-tauri-v0-b0a58', // Pinboard APP ID. see https://www.pinboard.in/api/v2/register/
		'X-Auth-Token': '',
	}

	private mockApiUrl: string = 'https://run.mocky.io/v3/e91c7675-60b4-4260-aa73-122a4c336a29'

	constructor(token: string) {
		this.updateToken(token)
	}

	updateToken(token: string) {
		this.defaultHeaders['X-Auth-Token'] = token
	}

	hasTokenPresent(): boolean {
		return this.defaultHeaders['X-Auth-Token'] !== ''
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

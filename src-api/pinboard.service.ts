import {
	Body,
	fetch,
	type FetchOptions,
	getClient,
	type RequestOptions,
	ResponseType,
	type Response,
} from '@tauri-apps/api/http'
import {
	HEADER_KEY_CONTENT_TYPE,
	HEADER_KEY_PINBOARD_APP_ID,
	HEADER_KEY_PINBOARD_TOKEN,
	HEADER_VALUE_CONTENT_TYPE_JSON,
} from './contants'

export class PinboardService {
	private defaultHeaders: Record<string, string> = {}

	// mock
	private mockyApiUrl: string = 'https://run.mocky.io/v3/e91c7675-60b4-4260-aa73-122a4c336a29'
	private mockApiIOUrl: string = 'https://62acdc229fa81d00a7ba907e.mockapi.io'
	// pinboard
	private testServerApi: string = 'https://api.test.pinboard.in/v2'
	private serverApi: string = 'https://api.pinboard.in/v2'
	// localhost mockoon
	private serverLocalhost: string = 'http://127.0.0.1:3000'

	private server: string = this.serverLocalhost
	private username: string

	constructor() {
		// set default content-type to app/json
		this.defaultHeaders[HEADER_KEY_CONTENT_TYPE] = HEADER_VALUE_CONTENT_TYPE_JSON
	}

	private checkRequirements(): boolean {
		if (!this.hasTokenPresent()) {
			throw new Error('no token set. use updateToken(token) to set auth token!')
		}
		if (!this.hasAppIdentifierPresent()) {
			throw new Error('no app identifier set. use setAppId(appId) to set app identifier!')
		}
		if (!this.username || !this.username.length) {
			throw new Error('no username set. use setUsername(username) to set username!')
		}
		return true
	}

	private getAuthTokenQueryParam(): string {
		return `${this.username}:${this.defaultHeaders[HEADER_KEY_PINBOARD_TOKEN]}`
	}

	private async get<T>(url, extraOptions?: Partial<FetchOptions>) {
		this.checkRequirements()
		const defaultOptions: FetchOptions = {
			method: 'GET',
			timeout: 50,
			responseType: ResponseType.JSON,
			headers: this.defaultHeaders,
			query: {
				auth_token: this.getAuthTokenQueryParam(),
				format: 'json',
			},
		}
		const options = { ...defaultOptions, ...extraOptions }
		return await fetch<T>(`${this.server}/${url}`, options)
	}

	private async post(url: string, body: Record<any, any>, options: RequestOptions): Promise<any> {
		this.checkRequirements()
		const client = await getClient()
		const response = await client.post(url, Body.json(body), options)
		console.log('response: ', response)
		return response
	}

	public hasAppIdentifierPresent(): boolean {
		return this.defaultHeaders[HEADER_KEY_PINBOARD_APP_ID] !== ''
	}

	public hasTokenPresent(): boolean {
		return this.defaultHeaders[HEADER_KEY_PINBOARD_TOKEN] !== ''
	}

	public setUsername(username: string): void {
		this.username = username
	}

	public setAuthToken(authToken: string): void {
		this.defaultHeaders[HEADER_KEY_PINBOARD_TOKEN] = authToken
	}

	public setAppId(appId: string): void {
		this.defaultHeaders[HEADER_KEY_PINBOARD_APP_ID] = appId
	}

	public async test(): Promise<Response<any>> {
		const result: Response<any> = await this.get<Response<any>>(`/test`, {
			responseType: ResponseType.Text,
		})
		return result
	}

	public async getAllPosts(req?: {
		tag?: string //	tag	filter by up to three tags
		start?: number //	int	offset value (default is 0)
		results?: number //	int	number of results to return. Default is all
		fromdt?: Date //	datetime	return only bookmarks created after this time
		todt?: Date //	datetime	return only bookmarks created before this time
		meta?: number //	int	include a change detection signature for each bookmark
	}): Promise<any[]> {
		const { data } = await this.get<any[]>(`/posts`)
		return data
	}

	public async getTags(): Promise<any[]> {
		const { data } = await this.get<any[]>(`/tags`)
		return data
	}

	/**
	 * username	string	test username
	 * has_archiving	boolean	creates an archival account
	 * privacy_lock	boolean	turns the PRIVACY LOCK user setting on
	 * is_deadbeat	boolean	emulates a delinquent account locked for non-payment
	 */
	public async createTestUser(req: {
		username: string
		has_archiving: boolean
		privacy_lock: boolean
		is_deadbeat: boolean
	}): Promise<any> {
		return await this.post(`${this.testServerApi}/test/create/`, req, {
			responseType: ResponseType.Text,
		}).catch((error) => {
			console.error(error)
		})
	}
}

const pinboardService = new PinboardService()
export { pinboardService }

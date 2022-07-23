import {
	Body,
	fetch,
	getClient,
	ResponseType,
	type Response,
	type FetchOptions,
	type RequestOptions,
} from '@tauri-apps/api/http'
import {
	HEADER_KEY_CONTENT_TYPE,
	HEADER_KEY_PINBOARD_APP_ID,
	HEADER_KEY_PINBOARD_TOKEN,
	HEADER_VALUE_CONTENT_TYPE_JSON,
} from './contants'

export class PinboardServiceV2 {
	private defaultHeaders: Record<string, string> = {}
	private api: string = 'https://api.pinboard.in/v2'
	private username: string

	private defaultFetchOptions: FetchOptions = {
		method: 'GET',
		timeout: 50,
		responseType: ResponseType.JSON,
		headers: this.defaultHeaders,
		query: {
			auth_token: this.getAuthTokenQueryParam(),
			format: 'json',
		},
	}

	constructor() {
		// set default content-type to app/json
		this.defaultHeaders[HEADER_KEY_CONTENT_TYPE] = HEADER_VALUE_CONTENT_TYPE_JSON
	}

	private hasTokenPresent(): boolean {
		return this.defaultHeaders[HEADER_KEY_PINBOARD_TOKEN] !== ''
	}

	private hasAppIdentifierPresent(): boolean {
		return this.defaultHeaders[HEADER_KEY_PINBOARD_APP_ID] !== ''
	}

	private hasUsernameSet(): boolean {
		return this.username && this.username.length !== undefined
	}

	private checkRequirements(): boolean {
		if (!this.hasTokenPresent()) {
			throw new Error('no token set. use updateToken(token) to set auth token!')
		}
		if (!this.hasAppIdentifierPresent()) {
			throw new Error('no app identifier set. use setAppId(appId) to set app identifier!')
		}
		if (!this.hasUsernameSet()) {
			throw new Error('no username set. use setUsername(username) to set username!')
		}
		return true
	}

	private getAuthTokenQueryParam(): string {
		return `${this.username}:${this.defaultHeaders[HEADER_KEY_PINBOARD_TOKEN]}`
	}

	private async get<T>(url, extraOptions?: Partial<FetchOptions>) {
		this.checkRequirements()
		const options = { ...this.defaultFetchOptions, ...extraOptions }
		return await fetch<T>(`${this.api}/${url}`, options)
	}

	private async post(url: string, body: Record<any, any>, options: RequestOptions): Promise<any> {
		this.checkRequirements()
		const client = await getClient()
		const response = await client.post(url, Body.json(body), options)
		console.log('response: ', response)
		return response
	}

	public init(username: string, authToken: string, appId: string) {
		this.username = username
		this.defaultHeaders[HEADER_KEY_PINBOARD_TOKEN] = authToken
		this.defaultHeaders[HEADER_KEY_PINBOARD_APP_ID] = appId
		console.info('pinboardServiceV1 username set: ', username)
	}

	public async test(): Promise<Response<any>> {
		return await this.get<Response<any>>(`/test`, {
			responseType: ResponseType.Text,
		})
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
		const { data } = await this.get<any[]>(`/tags/get`)
		return data
	}

	public async renameTag(oldName: string, newName: string): Promise<any[]> {
		const { data } = await this.get<any[]>(`/tags/rename`, {
			query: {
				old: oldName,
				new: newName,
			},
		})
		return data
	}

	public async deleteTag(tagName: string): Promise<any[]> {
		const { data } = await this.get<any[]>(`/tags/delete`, {
			query: {
				tag: tagName,
			},
		})
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
		return await this.post(`${this.api}/test/create/`, req, {
			responseType: ResponseType.Text,
		}).catch((error) => {
			console.error(error)
		})
	}
}
const pinboardService = new PinboardServiceV2()
export { pinboardService }

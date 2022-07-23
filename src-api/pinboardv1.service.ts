import {
	Body,
	fetch,
	getClient,
	ResponseType,
	type FetchOptions,
	type RequestOptions,
} from '@tauri-apps/api/http'
import { HEADER_KEY_PINBOARD_APP_ID, HEADER_KEY_PINBOARD_TOKEN } from './contants'
import type { Tags } from './typing'

export class PinboardServiceV1 {
	private username: string
	private defaultHeaders: Record<string, string> = {}
	private api: string = 'https://api.pinboard.in/v1'

	private defaultFetchOptions: () => FetchOptions = () => ({
		method: 'GET',
		timeout: 50,
		responseType: ResponseType.JSON,
		headers: this.defaultHeaders,
		query: {
			auth_token: this.getAuthTokenQueryParam(),
			format: 'json',
		},
	})

	constructor() {}

	private getAuthTokenQueryParam(): string {
		return `${this.username}:${this.defaultHeaders[HEADER_KEY_PINBOARD_TOKEN]}`
	}

	private async get<T>(url, extraOptions?: Partial<FetchOptions>) {
		this.checkRequirements()
		const options = { ...this.defaultFetchOptions(), ...extraOptions }
		console.info('options: ', options)
		return await fetch<T>(`${this.api}/${url}`, options)
	}

	private async post(url: string, body: Record<any, any>, options: RequestOptions): Promise<any> {
		this.checkRequirements()
		const client = await getClient()
		const response = await client.post(url, Body.json(body), options)
		console.log('response: ', response)
		return response
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

	public init(username: string, authToken: string): void {
		this.username = username
		this.defaultHeaders[HEADER_KEY_PINBOARD_TOKEN] = authToken
		console.info('username set: ', this.username)
		console.info('authToken set: ', this.defaultHeaders[HEADER_KEY_PINBOARD_TOKEN])
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

	public async getTags(): Promise<Tags> {
		const { data } = await this.get<{ [name: string]: number }>(`/tags/get`)
		return Object.entries(data).map(([name, count]) => ({ name, count }))
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
}

const pinboardService = new PinboardServiceV1()
export { pinboardService }

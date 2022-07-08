import { HEADER_KEY_CONTENT_TYPE, HEADER_VALUE_CONTENT_TYPE_JSON } from './contants'
import { PinboardServiceV1, pinboardServiceV1 } from './pinboardv1.service'
import { PinboardServiceV2, pinboardServiceV2 } from './pinboardv2.service'
import { PINBOARD_APP_ID } from '../src/core/constants'
import type { Response } from '@tauri-apps/api/http'

export enum PinboardApiVersion {
	V1 = 'v1',
	V2 = 'v2',
}

export class PinboardService {
	private defaultHeaders: Record<string, string> = {}
	// private apiMap: Record<string, string> = {
	// 	mocky: 'https://run.mocky.io/v3/e91c7675-60b4-4260-aa73-122a4c336a29',
	// 	mockApiIO: 'https://62acdc229fa81d00a7ba907e.mockapi.io',
	// 	pinboardv2test: 'https://api.test.pinboard.in/v2',
	// 	pinboardv2: 'https://api.pinboard.in/v2',
	// 	pinboardv1: 'https://api.pinboard.in/v1',
	// 	mockoon: 'http://127.0.0.1:3000',
	// }
	private version: PinboardApiVersion
	private v1: PinboardServiceV1 = pinboardServiceV1
	private v2: PinboardServiceV2 = pinboardServiceV2
	private api: Record<PinboardApiVersion, PinboardServiceV1 | PinboardServiceV2> = {
		[PinboardApiVersion.V1]: this.v1,
		[PinboardApiVersion.V2]: this.v2,
	}

	constructor(apiVersion: PinboardApiVersion = PinboardApiVersion.V1) {
		// set default content-type to app/json
		this.version = apiVersion
		this.defaultHeaders[HEADER_KEY_CONTENT_TYPE] = HEADER_VALUE_CONTENT_TYPE_JSON
	}

	public init(username: string, token: string, version: PinboardApiVersion): void {
		this.useVersion(version)
		if (this.version === PinboardApiVersion.V1) {
			this.v1.init(username, token)
		} else if (this.version === PinboardApiVersion.V2) {
			this.v2.init(username, token, PINBOARD_APP_ID)
		}
	}

	public useVersion(apiVersion: PinboardApiVersion): void {
		this.version = apiVersion
		console.info('pinboardService version set: ', apiVersion)
	}

	/**=====================================
	 *============= COMMON API =============
	 ======================================*/

	public async getAllPosts(req: {
		tag?: string //	tag	filter by up to three tags
		start?: number //	int	offset value (default is 0)
		results?: number //	int	number of results to return. Default is all
		fromdt?: Date //	datetime	return only bookmarks created after this time
		todt?: Date //	datetime	return only bookmarks created before this time
		meta?: number //	int	include a change detection signature for each bookmark
	}): Promise<any[]> {
		return await this.api[this.version].getAllPosts(req)
	}

	public async getTags(): Promise<any[]> {
		return await this.api[this.version].getTags()
	}

	public async renameTag(oldName: string, newName: string): Promise<any[]> {
		return await this.api[this.version].renameTag(oldName, newName)
	}

	public async deleteTag(tagName: string): Promise<any[]> {
		return await this.api[this.version].deleteTag(tagName)
	}

	/**=====================================
	 *============ V2 API ==================
	 ======================================*/

	public async test(): Promise<Response<any>> {
		return await this.v2.test()
	}

	public async createTestUser(req: {
		username: string
		has_archiving: boolean
		privacy_lock: boolean
		is_deadbeat: boolean
	}): Promise<Response<any>> {
		return await this.v2.createTestUser(req)
	}
}

const pinboardService = new PinboardService()
export { pinboardService }

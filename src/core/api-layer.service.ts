import { persistenceService, pinboardService, progressService } from '../core'
import { PERSISTED_KEY_PINBOARD_TOKEN, PERSISTED_KEY_PINBOARD_USERNAME } from './constants'

export class ApiLayerService {
	private static async wrap<T, F = any>(
		execute: () => Promise<T>,
		errorHandler?: (e: any) => F
	): Promise<T> {
		progressService.start()
		try {
			const result: T = await execute()
			progressService.done()
			return result
		} catch (e) {
			errorHandler ? errorHandler(e) : console.error(e)
			progressService.done()
		}
	}

	constructor() {}

	public async initialise(): Promise<boolean> {
		const execute = async function execute() {
			const token = await persistenceService.get<string>(PERSISTED_KEY_PINBOARD_TOKEN)
			const username = await persistenceService.get<string>(PERSISTED_KEY_PINBOARD_USERNAME)
			if (!token && !username) {
				return false
			}
			pinboardService.setUsername(username)
			pinboardService.setAuthToken(token)
			console.info('API initialised with username and token: ', username, token)
			return true
		}

		const errorHandler = async function () {
			console.info('API not initialised, enter username and token on settings page.')
		}
		return ApiLayerService.wrap<boolean>(execute, errorHandler)
	}

	public async test() {
		return ApiLayerService.wrap<any>(async () => {
			return await pinboardService.test()
		})
	}

	public async authenticateTestUser() {}

	public async createTestUser(username: string) {
		return ApiLayerService.wrap<any>(async () => {
			return await pinboardService.createTestUser({
				username: username,
				has_archiving: false,
				privacy_lock: false,
				is_deadbeat: false,
			})
		})
	}

	public async getTags() {
		return ApiLayerService.wrap<any>(async () => {
			const result = await pinboardService
				.getTags
				//   {
				//   has_archiving: false,
				//   is_deadbeat: false,
				// }
				()
			console.log('result: ', result)
			return result
		})
	}

	public async getAllPosts() {
		return ApiLayerService.wrap<any>(async () => {
			const result = await pinboardService
				.getAllPosts
				// {
				//   tag: undefined,
				//   start: undefined,
				//   results: undefined,
				//   fromdt: undefined,
				//   todt: undefined,
				//   meta: undefined,
				// }
				()
			console.log('result: ', result)
			return result
		})
	}

	public async updateTag(tag) {
		return { createdAt: '', id: '', lastUpdatedAt: '', name: '', url: '' }
	}
}

const apiLayerService = new ApiLayerService()
export { apiLayerService }

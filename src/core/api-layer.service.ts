import { PERSISTED_KEY_PINBOARD_TOKEN, PERSISTED_KEY_PINBOARD_USERNAME } from './constants'
import { nanoid } from 'nanoid'
import { notificationsStore } from './notifications.store'
import { progressService } from './progress.service'
import { persistenceService } from './persistence.service'
import { pinboardService } from '../../src-api'
import { PinboardApiVersion } from '../../src-api/pinboard.service'

export class ApiLayerService {
	private static async wrap<T, F = any>(
		execute: () => Promise<T>,
		errorHandler?: (e: any) => F
	): Promise<T> {
		progressService.start()
		try {
			// console.log('wrap trying..')
			const result: T = await execute()
			progressService.done()
			return result
		} catch (e) {
			// console.log('wrap failing..')
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
			pinboardService.init(username, token, PinboardApiVersion.V1)
			return true
		}

		const errorHandler = async function () {
			console.info('API not initialised, enter username and token on settings page.')
		}
		return ApiLayerService.wrap<boolean>(execute, errorHandler)
	}

	/**==============================================
	 *============ Pinboard V1 API ==================
	 ===============================================*/

	public async getTags() {
		const errorHandler = (error) => {
			notificationsStore.add({
				id: nanoid(),
				kind: 'error',
				title: 'error fetching tags',
				subtitle: error,
				caption: '',
			})
		}
		return ApiLayerService.wrap<any>(pinboardService.getTags.bind(pinboardService), errorHandler)
	}

	public async getAllPosts() {
		return ApiLayerService.wrap<any>(async () => {
			const result = await pinboardService.getAllPosts({})
			console.log('result: ', result)
			return result
		})
	}

	public async renameTag(tag) {
		return { createdAt: '', id: '', lastUpdatedAt: '', name: '', url: '' }
	}

	/**==============================================
	 *============ Pinboard V2 API ==================
	 ===============================================*/

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
}

const apiLayerService = new ApiLayerService()
export { apiLayerService }

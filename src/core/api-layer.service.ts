import { persistenceService, pinboardService, progressService } from '../core'
import { PERSISTED_KEY_PINBOARD_TOKEN, PERSISTED_KEY_PINBOARD_USERNAME } from './constants'
import { nanoid } from 'nanoid'
import { notificationsStore, type NotificationsStore } from './notifications.store'

export class ApiLayerService {
	private static async wrap<T, F = any>(
		execute: () => Promise<T>,
		errorHandler?: (e: any) => F
	): Promise<T> {
		progressService.start()
		try {
			console.log('wrap trying..')
			const result: T = await execute()
			progressService.done()
			return result
		} catch (e) {
			console.log('wrap failing..')
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
		// const result = await pinboardService.getTags()
		// console.log('result: ', result)

		const errorHandler = (error) => {
			console.log('error')
			console.log(error)
			console.log('wrap error handling...')
			console.log('calling notifications.add...')
			notificationsStore.add({
				id: nanoid(),
				kind: 'error',
				title: 'error fetching tags',
				subtitle: error.toString(),
				caption: 'caption suckaa',
			})
		}
		return ApiLayerService.wrap<any>(pinboardService.getTags.bind(pinboardService), errorHandler)
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

import { PERSISTED_KEY_PINBOARD_TOKEN, PERSISTED_KEY_PINBOARD_USERNAME } from './constants'
import { persistenceService as persistor } from './persistence.service'
import { pinboardService as pinboard } from '../../src-api'
import { progressiveFetch } from './try-catch-progressor'
import type { Tags } from '../../src-api/typing'

export class ApiLayerService {
	constructor() {}

	public async initialise(): Promise<boolean> {
		const execute = async function execute() {
			const token = await persistor.get<string>(PERSISTED_KEY_PINBOARD_TOKEN)
			const username = await persistor.get<string>(PERSISTED_KEY_PINBOARD_USERNAME)
			if (!token && !username) {
				return false
			}
			pinboard.init(username, token)
			return true
		}

		return progressiveFetch<boolean>(
			execute,
			'API not initialised',
			'enter username and token on settings page'
		)
	}

	/**==============================================
	 *============ Pinboard V1 API ==================
	 ===============================================*/

	public async getTags(): Promise<Tags> {
		return progressiveFetch<any>(pinboard.getTags.bind(pinboard))
	}

	public async renameTag(oldName: string, newName: string): Promise<any> {
		return progressiveFetch<any>(pinboard.renameTag.apply(pinboard, arguments)) // .bind(pinboard)
	}

	public async getAllPosts() {
		return progressiveFetch<any>(async () => {
			const result = await pinboard.getAllPosts({})
			console.log('result: ', result)
			return result
		})
	}
}

const apiLayerService = new ApiLayerService()
export { apiLayerService }

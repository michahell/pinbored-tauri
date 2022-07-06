import { router } from 'tinro'
import { loggingService } from './logging.service'
import { apiLayerService } from './api-layer.service'

const bootstrap = async () => {
	// setup in-app routing to use in-memory method for history
	router.mode.hash()
	// start logging the rust process
	// RUST_LOG="debug" RUST_BACKTRACE=1 npm run tauri dev
	await loggingService.start()
	// initialise API layer
	await apiLayerService.initialise()
}

export default bootstrap

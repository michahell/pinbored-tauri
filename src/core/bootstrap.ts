import { router } from 'tinro'
import { loggingService } from './logging.service'

const bootstrap = () => {
	// setup in-app routing to use in-memory method for history
	router.mode.hash()
	// start logging the rust process
	// RUST_LOG="debug" RUST_BACKTRACE=1 npm run tauri dev
	loggingService.start()
}

export default bootstrap

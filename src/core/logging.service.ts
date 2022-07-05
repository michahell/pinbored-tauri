import { trace, info, error, attachConsole } from 'tauri-plugin-log-api'

class LoggingService {
	private detach: any

	constructor() {
		this.start()
	}

	public async start() {
		// with LogTarget::Webview enabled this function will print logs to the browser console
		this.detach = await attachConsole()
		info('started logging service')
		trace('Trace')
		error('Error')
	}

	public async stop() {
		// detach the browser console from the log stream
		this.detach()
	}
}

const loggingService = new LoggingService()
export { loggingService }

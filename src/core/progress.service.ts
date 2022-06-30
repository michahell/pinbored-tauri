import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

NProgress.configure({
	// Full list: https://github.com/rstacruz/nprogress#configuration
	minimum: 0.16,
	showSpinner: false,
})

export class ProgressService {
	constructor() {}

	set(amount: number) {
		NProgress.set(amount)
	}

	inc(amount: number) {
		NProgress.inc(amount)
	}

	start() {
		NProgress.start()
	}

	done() {
		NProgress.done()
	}
}

const progressService: ProgressService = new ProgressService()
export { progressService }

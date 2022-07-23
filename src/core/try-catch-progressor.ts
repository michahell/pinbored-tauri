import { progressService as progress } from './progress.service'
import { notificationsStore } from './notifications.store'
import { nanoid } from 'nanoid'

const defaultErrorHandler = (error: unknown) => {
	notificationsStore.add({
		id: nanoid(),
		kind: 'error',
		title: 'error fetching tags',
		subtitle: error.toString(),
		caption: '',
	})
}

const progressiveFetch = async function progressiveFetch<T, F = any>(
	execute: () => Promise<T>,
	errorTitle: string = '',
	errorSubTitle: string = '',
	errorHandler: (
		error: unknown,
		errorTitle: string,
		errorSubTitle: string
	) => void = defaultErrorHandler
): Promise<T> {
	progress.start()
	try {
		const result: T = await execute()
		progress.done()
		return result
	} catch (error) {
		errorHandler(error, errorTitle, errorSubTitle)
		progress.done()
	}
}

export { progressiveFetch }

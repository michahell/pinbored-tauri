import { type Readable, writable } from 'svelte/store'
import type { PinboardNotification } from './types/notification.interface'

interface NotificationsStore extends Readable<PinboardNotification[]> {
	add: (notification: PinboardNotification) => void
	remove: (notification: PinboardNotification) => void
	clearAll: () => void
}

const createNotificationsStore = () => {
	const { subscribe, set, update } = writable<PinboardNotification[]>([])

	const updateNotification = (notification: PinboardNotification) => {
		return update((notifications) => [notification, ...notifications])
	}

	const removeNotification = (notification: PinboardNotification) => {
		update((notifications) => notifications.filter(({ id }) => notification.id !== id))
	}

	return {
		subscribe,
		add: updateNotification,
		remove: removeNotification,
		clearAll: () => set([]),
	}
}

const notificationsStore = createNotificationsStore()
export { notificationsStore }
export type { NotificationsStore }

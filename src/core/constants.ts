// App constants
const PINBOARD_APP_ID = 'pinbored-tauri-v0-b0a58' // Pinboard APP ID for pinbored-tauri

// Persistence
const PERSISTENCE_STORE_NAME: string = 'settings.dat'
const PERSISTED_KEY_FIRST_RUN: string = 'core.first-run'
const PERSISTED_KEY_PINBOARD_USERNAME: string = 'pinboard.username'
const PERSISTED_KEY_PINBOARD_TOKEN: string = 'pinboard.usertoken'

// Svelte Store keys
const SVELTE_STORE_KEY_NOTIFICATIONS: string = 'notifications'

export {
	PINBOARD_APP_ID,
	PERSISTENCE_STORE_NAME,
	PERSISTED_KEY_FIRST_RUN,
	PERSISTED_KEY_PINBOARD_USERNAME,
	PERSISTED_KEY_PINBOARD_TOKEN,
	SVELTE_STORE_KEY_NOTIFICATIONS,
}

import type { Tags } from '../../../src-api'
import type { Writable } from 'svelte/store'

// noinspection SpellCheckingInspection
export interface PinboredStore {
	bootstrapped: Writable<boolean> // has the app's bootstrapping happened?
	tags: Writable<Tags> // fetched pinboard tags
	filteredTags: Writable<Tags> // fetched pinboard tags
}

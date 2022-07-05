import { writable } from 'svelte/store'

export const selectedTagStore = writable('') // subscribe, set, update
export const tagsStore = writable([]) // subscribe, set, update

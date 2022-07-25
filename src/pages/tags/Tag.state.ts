import { readable, writable } from 'svelte/store'
import type { Tag, Tags } from '../../../src-api'

let tagStore = readable({
	allTags: writable<Tags>([]),
	tagStringSearch: writable<string>(''),
	filteredTags: writable<Tags>([]),
	selectedTag: writable<Tag | undefined>(undefined),
})

export { tagStore }

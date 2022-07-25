<script lang="ts">
  import type { Writable } from 'svelte/store'
  import type { Tags } from '../../../src-api'
  import { Button, Search } from 'carbon-components-svelte'
  import { get } from 'svelte/store'
  import { onMount } from 'svelte'
  import { tagStore } from './Tag.state'

  const tags: Writable<Tags> = get(tagStore).allTags
  const filteredTags: Writable<Tags> = get(tagStore).filteredTags

  const tagStringSearchStore: Writable<string> = get(tagStore).tagStringSearch

  let cachedTags: Tags = []

  function filter(value: string): Tags {
    return cachedTags.filter((storetag) => storetag.name.includes(value))
  }

  function updateFilter(search: string): void {
    const filtered = filter(search)
    console.log(`filtered on: ${search}, length: ${filtered.length}`)
    filteredTags.set(filtered)
  }

  function onFilterKeyUp(event): void {
    const searchTerm: string = event.target.value
    tagStringSearchStore.set(searchTerm)
    updateFilter(searchTerm)
  }

  function onClear(): void {
    tagStringSearchStore.set('')
    updateFilter('')
  }

  onMount(async () => {
    const tagSubscription = tags.subscribe((storeTags: Tags) => (cachedTags = storeTags))

    return () => {
      console.info('text search bar onDestroy...')
      tagSubscription()
    }
  })
</script>

<div class="search-wrapper">
  <div class="search-bar-wrapper">
    <Search on:keyup={onFilterKeyUp} on:clear={onClear} light placeholder={'Filter...'} />
  </div>
  <div class="search-button-wrapper">
    <Button>search</Button>
  </div>
</div>

<style lang="scss">
  .search-wrapper {
    display: flex;

    .search-bar-wrapper {
      display: flex;
      flex: 1 1 auto;
    }

    .search-button-wrapper {
      display: flex;
      flex: 0 0 auto;
    }
  }
</style>

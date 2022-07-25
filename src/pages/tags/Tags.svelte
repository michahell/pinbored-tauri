<script lang="ts">
  import type { Writable } from 'svelte/store'
  import type { Tag, Tags } from '../../../src-api'
  import { Route, router } from 'tinro'
  import { Pagination } from 'carbon-components-svelte'
  import { onMount, getContext } from 'svelte'
  import { get } from 'svelte/store'
  import { apiLayerService as api } from '../../core'
  import { tagStore } from './Tag.state'
  import TagPage from './Tag.svelte'
  import TagList from './TagList.svelte'

  const bootstrapped: Writable<boolean> = get(getContext('store')).bootstrapped

  const allTagsStore: Writable<Tags> = get(tagStore).allTags
  const filteredTagsStore: Writable<Tags> = get(tagStore).filteredTags
  const selectedTagStore: Writable<Tag | undefined> = get(tagStore).selectedTag
  const tagStringSearchStore: Writable<string> = get(tagStore).tagStringSearch

  let filteredTags: Tags = []
  let tagsPaged: Tags = []
  let page: number
  let pageSize: number

  async function getTags(): Promise<Tags> {
    return (await api.getTags()) ?? []
  }

  function onPaginationUpdate(update: { detail: { pageSize: number; page: number } }) {
    updatePagination(filteredTags)
  }

  function tagClicked(event) {
    const tag: Tag = event.detail
    selectedTagStore.set(tag)
    console.log('selected tag store tag: ', get(selectedTagStore))
    console.log('go to tag ', tag.name)
    router.goto(`/tags/${tag.name}`)
  }

  async function updateTagStores(): Promise<void> {
    const storedTags = get(allTagsStore)
    if (!storedTags?.length) {
      console.info('fetching tags...')
      const fetchedTags = await getTags()
      allTagsStore.set(fetchedTags)
      filteredTagsStore.set(fetchedTags) // also set filtered tags initially!
    }
  }

  function updatePagination(filteredTags: Tags): void {
    tagsPaged = filteredTags.filter(
      (tag, index) => index > page * pageSize && index <= (page + 1) * pageSize
    )
    console.log('updatePagination triggered. tagsPaged: ', tagsPaged.length)
  }

  onMount(async () => {
    const filteredTagsSub = filteredTagsStore.subscribe((newFilteredTags) => {
      console.log('filteredTagsSub fired')
      filteredTags = newFilteredTags
      updatePagination(filteredTags)
    })

    const tagStringSearchStoreSub = tagStringSearchStore.subscribe((searchString) => {})

    const unsubBootstrapped = bootstrapped.subscribe(async (bootstrapped) => {
      if (!bootstrapped) {
        return
      }
      await updateTagStores()
    })

    return () => {
      console.info('tags comp onDestroy...')
      unsubBootstrapped()
      filteredTagsSub()
    }
  })
</script>

<Route path="/">
  <Pagination
    on:update={onPaginationUpdate}
    bind:page
    bind:pageSize
    totalItems={filteredTags.length}
    pageSizes={[10, 15, 20, 25, 50]}
  />
  <section class="scrollable">
    <TagList tags={tagsPaged} tagSearchString={$tagStringSearchStore} on:tagClicked={tagClicked} />
  </section>
</Route>

<Route path="/:tag" let:meta>
  <!--  tag name: {meta.params.tag}-->
  <TagPage />
</Route>

<style lang="scss">
  .scrollable {
    height: 100%;
    overflow: scroll;
  }
</style>

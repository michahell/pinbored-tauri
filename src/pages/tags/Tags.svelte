<script lang="ts">
  import { Route } from 'tinro'
  import { Pagination } from 'carbon-components-svelte'
  import { onMount, setContext, getContext } from 'svelte'
  import { get, type Readable, writable } from 'svelte/store'
  import type { Writable } from 'svelte/store'
  import { apiLayerService as api } from '../../core'
  import TagPage from './Tag.svelte'
  import TagList from './TagList.svelte'
  import type { Tags } from '../../../src-api/typing'
  import type { PinboredStore } from '../../core/types/pinbored.store'

  let tags: Tags = []
  let tagsPaged: Tags = []
  const selectedTag = writable('')
  setContext('selectedTag', selectedTag)

  const store: Readable<PinboredStore> = getContext('store')
  const bootstrapped: Writable<boolean> = get(store).bootstrapped

  async function getTags(): Promise<Tags> {
    return (await api.getTags()) ?? []
  }

  function onPaginationUpdate(update: { detail: { pageSize: number; page: number } }) {
    let { pageSize, page } = update.detail
    tagsPaged = tags.filter(
      (tag, index) => index > page * pageSize && index <= (page + 1) * pageSize
    )
  }

  onMount(async () => {
    const unsubBootstrapped = bootstrapped.subscribe(async (bootstrapped) => {
      console.log('bootstrapped: ', bootstrapped)
      if (!bootstrapped) {
        return
      }
      if (!tags || tags.length === 0) {
        console.log('onMount, getting tags...')
        tags = await getTags()
      }
      onPaginationUpdate({ detail: { pageSize: 10, page: 0 } })
    })

    return () => {
      console.info('tags comp onDestroy...')
      unsubBootstrapped()
    }
  })
</script>

<Route path="/">
  <Pagination
    on:update={onPaginationUpdate}
    totalItems={tags.length}
    page={0}
    pageSizes={[10, 15, 20, 25, 50]}
  />
  <section class="scrollable">
    <TagList tags={tagsPaged} />
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

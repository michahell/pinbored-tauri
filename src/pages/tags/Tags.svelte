<script lang="ts">
  import { Column, Grid, Row, Tag } from 'carbon-components-svelte'
  import { apiLayerService } from '../../core'
  import { Route, router } from 'tinro'
  import TagPage from './Tag.svelte'
  import { randomFrom } from '../../core/utils'
  import { onMount, setContext } from 'svelte'

  type PinboardTag = {
    id: string
    name: string
    url: string
    lastUpdatedAt: string
    createdAt: string
  }

  const carbonTagColors: string[] = [
    'red',
    'magenta',
    'purple',
    'blue',
    'cyan',
    'teal',
    'green',
    'gray',
    'cool-gray',
    'warm-gray',
  ]

  const api = apiLayerService
  let tags: PinboardTag[] = []
  let selectedTag: PinboardTag

  setContext('tags::getSelectedTag', { getSelectedTag: () => selectedTag })

  async function getTags(): Promise<PinboardTag[]> {
    return (await api.getTags()) ?? []
  }

  const onTagClick = (tag: PinboardTag) => {
    console.log('tag clicked: ', tag)
    selectedTag = tag
    router.goto(`/tags/${tag.name}`)
  }

  onMount(async () => {
    console.log('onMount, getting tags...')
    tags = await getTags()
  })
</script>

<Route path="/">
  <Grid>
    <Row>
      <Column>
        <h2>Tags</h2>
        {#each tags as tag}
          <Tag
            type={randomFrom(carbonTagColors)}
            interactive
            on:click={() => {
              onTagClick(tag)
            }}>{tag.name}</Tag
          >
        {/each}
      </Column>
    </Row>
  </Grid>
</Route>

<Route path="/:tag" let:meta>
  tag name: {meta.params.tag}
  <TagPage />
</Route>

<style lang="scss">
</style>

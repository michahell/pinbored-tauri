<script lang="ts">
  import { Button, Column, Content, Grid, Row, Tag } from 'carbon-components-svelte'
  import { apiLayerService } from '../../core'
  import { Route, router } from 'tinro'
  import TagPage from './Tag.svelte'
  // import { tagStore } from './tag.store'

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

  const randomFrom = function <T = string>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  let tags: PinboardTag[] = []
  // let selectedTag: string = $tagStore

  const api = apiLayerService
  let fetched: boolean = false

  async function getTags() {
    tags = await api.getTags()
    fetched = true
  }

  function onTagClick(tag): void {
    router.goto(`/tags/${tag.name}`)
    // tagStore.set(tag)
    console.log('tag clicked: ', tag.name)
  }
</script>

<Route path="/" let:meta>
  <Content>
    <Grid>
      <Row>
        <Column>
          <h2>Tags</h2>
        </Column>
      </Row>
      <Row>
        <Column>
          <Button on:click={getTags} bind:disabled={fetched}>fetch tags</Button>
        </Column>
      </Row>
      <Row>
        <Column>
          {#each tags as tag}
            <Tag type={randomFrom(carbonTagColors)} interactive on:click={onTagClick(tag)}
              >{tag.name}</Tag
            >
          {/each}
        </Column>
      </Row>
    </Grid>
  </Content>
</Route>

<Route path="/:tag" let:meta>
  tag name: {meta.params.tag}
  <TagPage />
  <!--  updatedTag={selectedTag}-->
</Route>

<style lang="scss">
</style>

<script lang="ts">
  import { Column, Grid, Pagination, Row, Tag } from 'carbon-components-svelte'
  import { apiLayerService } from '../../core'
  import { Route, router } from 'tinro'
  import TagPage from './Tag.svelte'
  import { randomFrom } from '../../core/utils'
  import { onMount, setContext } from 'svelte'
  import TagList from './TagList.svelte'

  type PinboardTag = {
    id: string
    name: string
    url: string
    lastUpdatedAt: string
    createdAt: string
  }

  const api = apiLayerService
  let tags: PinboardTag[] = []
  let selectedTag: PinboardTag
  let currentPage: number = 0

  setContext('tags::getSelectedTag', { getSelectedTag: () => selectedTag })

  async function getTags(): Promise<PinboardTag[]> {
    return (await api.getTags()) ?? []
  }

  onMount(async () => {
    console.log('onMount, getting tags...')
    tags = await getTags()
  })
</script>

<Route path="/">
  <Pagination totalItems={tags.length} page={currentPage} />
  <section class="scrollable">
    <TagList {tags} />
    <!--    <Grid>-->
    <!--      <Row>-->
    <!--        <Column>-->
    <!--          <h2>Tags</h2>-->
    <!--          {#each tags as tag}-->
    <!--            <Tag-->
    <!--              type={randomFrom(carbonTagColors)}-->
    <!--              interactive-->
    <!--              on:click={() => {-->
    <!--                onTagClick(tag)-->
    <!--              }}>{tag.name}</Tag-->
    <!--            >-->
    <!--          {/each}-->
    <!--        </Column>-->
    <!--      </Row>-->
    <!--    </Grid>-->
  </section>
</Route>

<Route path="/:tag" let:meta>
  tag name: {meta.params.tag}
  <TagPage />
</Route>

<style lang="scss">
  .scrollable {
    height: 100%;
    overflow: scroll;
  }
</style>

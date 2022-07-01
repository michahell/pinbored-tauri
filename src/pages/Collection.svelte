<script lang="ts">
  import type { PinboardLink } from '../../src-api'
  import { onMount } from 'svelte'
  import { pinboardService } from '../core'
  import { Button, Column, Content, Grid, Row } from 'carbon-components-svelte'
  import LinkList from '../components/LinkList.svelte'
  import SearchBar from '../components/Searchbar.svelte'
  import { Route } from 'tinro'

  export let links: PinboardLink[] = []
  let fetched: boolean = false

  async function fetchLinks() {
    if (fetched === true) {
      return
    }
    try {
      links = await pinboardService.getLinks()
      console.log(links)
      fetched = true
    } catch (e) {
      console.error(e)
    }
  }

  onMount(() => {})
</script>

<Route path="/collection/*" breadcrumb="collection">
  <SearchBar>
  <Route path="/links" breadcrumb="links">
    <Content>
      <Grid>
        <Row>
          <Column>
            <h2>collection links</h2>
          </Column>
        </Row>
        <Row>
          <Column>
            <Button on:click={fetchLinks} bind:disabled={fetched}>fetch links</Button>
          </Column>
        </Row>
        <Row>
          <Column>
            <h3>links:</h3>
            <LinkList items={links} />
          </Column>
        </Row>
      </Grid>
    </Content>
  </Route>

  <Route path="/tags" breadcrumb="tags">
    <Content>
      <Grid>
        <Row>
          <Column>
            <h2>collection tags</h2>
          </Column>
        </Row>
      </Grid>
    </Content>
  </Route>
</Route>

<style lang="scss">
</style>

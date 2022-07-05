<script lang="ts">
  import { Button, Column, Content, Grid, Row, ToastNotification } from 'carbon-components-svelte'
  import { onMount } from 'svelte'
  import { Route } from 'tinro'
  import LinkList from '../components/LinkList.svelte'
  import { pinboardService } from '../core'
  import type { PinboardLink } from '../../src-api'
  import { progressService } from '../core'

  onMount(() => {
    progressService.start()
    const teardownTimer = setInterval(progressService.inc, 250)
    setTimeout(() => {
      progressService.done()
      clearInterval(teardownTimer)
    }, 2000)
  })

  export let links: PinboardLink[] = []
  let fetched: boolean = false

  async function fetchLinks() {
    progressService.start()
    if (fetched === true) {
      return
    }
    try {
      links = await pinboardService.getLinks()
      console.log(links)
      fetched = true
      // progressService.done()
    } catch (e) {
      console.error(e)
      progressService.done()
    }
  }

  onMount(() => {})
</script>

<!-- tags -->
<Route path="/links/*" breadcrumb="links">
  <Route path="/turbo" breadcrumb="turbo">
    <Content>
      <Grid>
        <Row>
          <Column>
            <h2>turbo links</h2>
          </Column>
        </Row>
      </Grid>
    </Content>
  </Route>

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
<!-- tags -->
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

<style lang="scss">
</style>

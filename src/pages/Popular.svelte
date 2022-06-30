<script lang="ts">
  import type { PinboardLink } from '../../src-api'
  import { onMount } from 'svelte'
  import { pinboardService } from '../core'
  import { Button } from 'carbon-components-svelte'
  export let links: PinboardLink[] = []

  onMount(async () => {
    try {
      links = await pinboardService.getLinks()
      // console.log(links);
    } catch (e) {
      console.error(e)
    }
  })
</script>

<section>
  <Button>fetch links</Button>

  <p>links:</p>
  <ul>
    {#each links as link}
      <li>{link.url}</li>
    {/each}
  </ul>
</section>

<style lang="scss">
</style>

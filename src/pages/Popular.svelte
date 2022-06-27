<script lang="ts">
  import {onMount} from 'svelte';
  import { PinboardLink } from '../../src-api';
  import { pinboardService } from '../core/service-center';
  import { Button } from "carbon-components-svelte";
  export let links: PinboardLink[] = [];

  onMount(async () => {
    try {
      links = await pinboardService.getLinks();
      // console.log(links);
    } catch (e) {
      console.error(e);
    }
  });
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

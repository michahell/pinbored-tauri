<script lang="ts">
  import {onMount} from 'svelte';
  import pinboardService, {PinboardLink} from '../core/pinboard.service';
  import {Button} from 'agnostic-svelte';

  export let links: PinboardLink[] = [];

  onMount(async () => {
    try {
      links = await pinboardService.getLinks();
      console.log(links);
    } catch (e) {
      console.error(e);
    }
  });
</script>

<section>
  <Button mode="primary">fetch links</Button>

  <p>links:</p>
  <ul>
    {#each links as link}
      <li>{link.url}</li>
    {/each}
  </ul>

</section>

<style lang="scss">

</style>

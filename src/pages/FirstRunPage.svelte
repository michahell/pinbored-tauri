<script lang="ts">
  import {onMount} from 'svelte';
  import pinboardService from '../core/pinboard.service';
  import {Button} from 'agnostic-svelte';

  type Link = {
    createdAt: string,
    url: string,
    id: string
  };

  export let links: Link[] = [];

  onMount(async () => {
    try {
      const response = pinboardService.getLinks();
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  });

</script>

<section>
  <h1>Pinbored-tauri v0.1</h1>
  <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>

  <Button mode="primary">fetch links</Button>

  <p>links:</p>
  <ul>
    {#each links as link}
      <li>{link.url}</li>
    {/each}
  </ul>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>da<br/>
  da<br/>
  da<br/>
  da<br/>da<br/>
  da<br/>
  da<br/>
  da<br/>da<br/>
  da<br/>
  da<br/>
  da<br/>da<br/>
  da<br/>
  da<br/>
  da<br/>da<br/>
  da<br/>
  da<br/>
  da<br/>da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  da<br/>
  DRRRRRRRT<br/>
  da<br/>
</section>

<style lang="scss">
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>




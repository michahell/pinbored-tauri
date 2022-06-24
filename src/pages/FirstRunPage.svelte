<script lang="ts">
  import {onMount} from 'svelte';
  import {PinboardApiService} from '../core/pinboard-api-service';
  import {Button} from 'agnostic-svelte';

  type Link = {
    createdAt: string,
    url: string,
    id: string
  };

  export let links: Link[] = [];

  const api: PinboardApiService = new PinboardApiService('API token');

  onMount(async () => {
    try {
      const response = api.getLinks();
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
</section>

<style lang="css">
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>




<script lang="ts">
  import { onMount } from 'svelte';
  import { fetch, ResponseType } from '@tauri-apps/api/http';

  type Link = {
    createdAt: string,
    url: string,
    id: string
  };

  export let links: Link[] = [];
  let mockApiUrl: string = 'https://run.mocky.io/v3/e91c7675-60b4-4260-aa73-122a4c336a29';

  onMount(async () => {
    try {
      const response = await fetch(mockApiUrl, {
        method: 'GET',
        timeout: 50,
        responseType: ResponseType.JSON
      });
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  });
</script>

<main>
	<h1>Pinbored-tauri v0.1</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<p>links:</p>
  <ul>
    {#each links as link}
      <li>{link.url}</li>
    {/each}
  </ul>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

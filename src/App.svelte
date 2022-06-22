<script lang="ts">
  import { onMount } from 'svelte';
  import { fetch } from '@tauri-apps/api/http';

  type Link = {
    createdAt: string,
    url: string,
    id: string
  };

  export let links: Link[] = [];
  let mockApiUrl: string = 'https://62acdc229fa81d00a7ba907e.mockapi.io';

  const fetchMy = (url, opts) => fetch(`${mockApiUrl}/${url}`, opts)

  onMount(async () => {
    // const response = await fetchMy('links', {
    //   method: 'GET',
    //   timeout: 50,
    // });
    // console.log(response);
    const response2 = await fetch('https://www.nu.nl', {
      method: 'GET',
      timeout: 50,
    });
    console.log(response2);
  })
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

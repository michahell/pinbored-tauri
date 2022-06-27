<!-- Transition.svelte -->
<script>
  import {router} from 'tinro';
  import {fade} from 'svelte/transition';
</script>

{#key $router.path}
  <div in:fade="{{ duration: 300 }}">
    <slot></slot>
  </div>
{/key}
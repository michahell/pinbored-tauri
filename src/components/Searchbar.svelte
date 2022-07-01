<script lang="ts">
  import Tags from 'svelte-tags-input'
  import { Button } from 'carbon-components-svelte'
</script>

<section class="searchbar" aria-label="search bar">
  <div class="tags-wrapper">
    <Tags />
  </div>
  <div class="tags-actions">
    <Button>search</Button>
  </div>
</section>

<style lang="scss">
  .searchbar {
    display: flex;
    flex-direction: row;

    .tags-wrapper {
      display: flex;
      flex: 1 1 auto;
      align-self: auto;
    }

    .tags-actions {
      display: flex;
      flex: 0 1 auto;
      align-self: flex-end;
    }
  }
</style>

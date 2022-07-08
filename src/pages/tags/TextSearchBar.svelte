<script>
  import { Button, Search } from 'carbon-components-svelte'
</script>

<div class="search-wrapper">
  <div class="search-bar-wrapper">
    <Search light placeholder={'Filter...'} />
  </div>
  <div class="search-button-wrapper">
    <Button>search</Button>
  </div>
</div>

<style lang="scss">
  .search-wrapper {
    display: flex;

    .search-bar-wrapper {
      display: flex;
      flex: 1 1 auto;
    }

    .search-button-wrapper {
      display: flex;
      flex: 0 0 auto;
    }
  }
</style>

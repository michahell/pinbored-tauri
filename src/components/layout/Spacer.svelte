<!--suppress CheckEmptyScriptTag -->
<script lang="ts">
  export let space: string = '1rem'
</script>

<div class="spacer" style="flex: 0 0 {space}" />

<style lang="scss">
  .spacer {
    justify-self: stretch;
    align-self: stretch;
    place-self: stretch;
    display: flex;
  }
</style>

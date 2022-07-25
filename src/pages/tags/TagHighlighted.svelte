<script lang="ts">
  import type { Tag } from '../../../src-api'

  export let tag: Tag
  export let tagSearchString: string
</script>

<span>
  <span class="pre-highlight">{tag.name.substring(0, tag.name.indexOf(tagSearchString))}</span><span
    class="highlighted">{tagSearchString}</span
  ><span class="post-highlight"
    >{tag.name.substring(tag.name.indexOf(tagSearchString) + tagSearchString.length)}</span
  >
</span>

<style lang="scss">
  $highlight-margin: 3px;
  .pre-highlight {
    position: relative;
    margin-right: $highlight-margin * -1;
  }
  .highlighted {
    display: inline-block;
    border-radius: 3px;
    padding: 2px $highlight-margin;
    background: yellow;
    border: 1px solid darkorange;
    color: #333;
  }
  .post-highlight {
    position: relative;
    margin-left: $highlight-margin * -1;
  }
</style>

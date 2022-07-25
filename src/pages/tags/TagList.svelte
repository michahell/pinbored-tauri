<script lang="ts">
  import type { Tag, Tags } from '../../../src-api'
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Button,
  } from 'carbon-components-svelte'
  import { Edit, TrashCan } from 'carbon-icons-svelte'
  import { createEventDispatcher } from 'svelte'
  import TagHighlighted from './TagHighlighted.svelte'

  export let tags: Tags = []
  export let tagSearchString: string = ''

  const dispatch = createEventDispatcher()

  function emitClicked(tag: Tag): void {
    console.log('emit clicked: ', tag)
    dispatch('tagClicked', tag)
  }

  function renameTag(tag: string): void {
    console.log('rename tag ', tag)
  }

  function deleteTag(tag: string): void {
    console.log('delete tag ', tag)
  }

  function highlightedSearchTerm(tag: string): string {
    const start = tag.indexOf(tagSearchString)
    const highlighted = `${tag.substring(
      0,
      start
    )}<span class="highlighted">${tagSearchString}</span>${tag.substring(
      start + tagSearchString.length
    )}`
    console.log('highlighted: ', highlighted)
    return highlighted
  }
</script>

<StructuredList condensed selection selected="row-1-value">
  <StructuredListHead>
    <StructuredListRow head>
      <StructuredListCell head>tag</StructuredListCell>
      <StructuredListCell head>count</StructuredListCell>
      <StructuredListCell head>actions</StructuredListCell>
    </StructuredListRow>
  </StructuredListHead>
  <StructuredListBody class="body-wrapper">
    {#each tags as tag}
      <StructuredListRow
        label
        for="row-{tag.name}"
        on:click={() => {
          emitClicked(tag)
        }}
      >
        <StructuredListCell>
          {#if tagSearchString.length}
            <!--{@html highlightedSearchTerm(tag.name)}-->
            <TagHighlighted {tag} {tagSearchString} />
          {:else}
            {tag.name}
          {/if}
        </StructuredListCell>
        <StructuredListCell>{tag.count}</StructuredListCell>
        <StructuredListCell>
          <!-- edit -->
          <Button
            kind="tertiary"
            size="small"
            iconDescription="rename tag"
            icon={Edit}
            tooltipPosition="left"
            tooltipAlignment="end"
            on:click={() => {
              renameTag(tag.name)
            }}
          />
          <!-- delete -->
          <Button
            kind="danger-tertiary"
            size="small"
            iconDescription="delete tag"
            icon={TrashCan}
            tooltipPosition="right"
            tooltipAlignment="end"
            on:click={() => {
              deleteTag(tag.name)
            }}
          />
        </StructuredListCell>
      </StructuredListRow>
    {/each}
  </StructuredListBody>
</StructuredList>

<style lang="scss">
  .body-wrapper {
    height: calc(100% - 20px);
  }
</style>

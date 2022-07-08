<script lang="ts">
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Button,
  } from 'carbon-components-svelte'
  import type { PinboardTag } from '../../../src-api'
  import { Edit, TrashCan } from 'carbon-icons-svelte'
  import { router } from 'tinro'

  export let tags: PinboardTag[] = []

  function renameTag(tag: PinboardTag) {
    console.log('rename tag ', tag.name)
    router.goto(`/tags/${tag.name}`)
  }

  function deleteTag(tag: PinboardTag) {
    console.log('delete tag ', tag.name)
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
  <StructuredListBody>
    {#each tags as tag}
      <StructuredListRow label for="row-{tag.name}">
        <StructuredListCell>{tag.name}</StructuredListCell>
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
              renameTag(tag)
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
              deleteTag(tag)
            }}
          />
        </StructuredListCell>
      </StructuredListRow>
    {/each}
  </StructuredListBody>
</StructuredList>

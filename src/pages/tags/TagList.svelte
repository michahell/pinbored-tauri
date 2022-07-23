<script lang="ts">
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Button,
  } from 'carbon-components-svelte'
  import { Edit, TrashCan } from 'carbon-icons-svelte'
  import { router } from 'tinro'

  export let tags: [tag: string, count: number][] = []

  function gotoTag(tag: string) {
    console.log('go to tag ', tag)
    router.goto(`/tags/${tag}`)
  }

  function renameTag(tag: string) {
    console.log('rename tag ', tag)
    router.goto(`/tags/${tag}`)
  }

  function deleteTag(tag: string) {
    console.log('delete tag ', tag)
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
      <StructuredListRow
        label
        for="row-{tag.name}"
        on:click={() => {
          gotoTag(tag.name)
        }}
      >
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

<script lang="ts">
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListInput,
  } from 'carbon-components-svelte'
  import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte'

  export let items: {
    id: string
    name: string
    url: string
    lastUpdatedAt: string
    createdAt: string
  }[] = []
</script>

<StructuredList selection selected="row-1-value">
  <StructuredListHead>
    <StructuredListRow head>
      <StructuredListCell head>ColumnA</StructuredListCell>
      <StructuredListCell head>ColumnB</StructuredListCell>
      <StructuredListCell head>ColumnC</StructuredListCell>
      <StructuredListCell head>{''}</StructuredListCell>
    </StructuredListRow>
  </StructuredListHead>
  <StructuredListBody>
    {#each items as item}
      <StructuredListRow label for="row-{item.id}">
        <StructuredListCell>name {item.name}</StructuredListCell>
        <StructuredListCell>url {item.url}</StructuredListCell>
        <StructuredListCell>lastModified {item.lastModified}</StructuredListCell>
        <StructuredListInput
          id="row-{item.id}"
          value="row-{item.id}-value"
          title="row-{item.id}-title"
          name="row-{item.id}-name"
        />
        <StructuredListCell>
          <CheckmarkFilled
            class="bx--structured-list-svg"
            aria-label="select an option"
            title="select an option"
          />
        </StructuredListCell>
      </StructuredListRow>
    {/each}
  </StructuredListBody>
</StructuredList>

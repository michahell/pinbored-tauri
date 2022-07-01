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
  import type { PinboardLink } from '../../src-api'

  export let items: PinboardLink[] = []
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
      <StructuredListRow label for="row-{item}">
        <StructuredListCell>Row {item}</StructuredListCell>
        <StructuredListCell>Row {item}</StructuredListCell>
        <StructuredListCell>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dui magna, finibus id tortor
          sed, aliquet bibendum augue. Aenean posuere sem vel euismod dignissim. Nulla ut cursus
          dolor. Pellentesque vulputate nisl a porttitor interdum.
        </StructuredListCell>
        <StructuredListInput
          id="row-{item}"
          value="row-{item}-value"
          title="row-{item}-title"
          name="row-{item}-name"
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

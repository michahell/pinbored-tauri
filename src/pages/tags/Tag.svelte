<script lang="ts">
  import { Button, Column, Content, Grid, Row, TextInput } from 'carbon-components-svelte'
  import { apiLayerService } from '../../core'

  export let updatedTag: {
    id: string
    name: string
    url: string
    lastUpdatedAt: string
    createdAt: string
  } = {}

  let newTagName: string = ''

  const api = apiLayerService

  async function updateTag(tag) {
    updatedTag = await api.updateTag({
      ...tag,
      name: newTagName,
    })
  }
</script>

<Content>
  <Grid>
    <Row>
      <Column>
        <h2>{updatedTag.name}</h2>
      </Column>
    </Row>
    <Row>
      <Column>
        <TextInput
          inline
          labelText="tag"
          placeholder="Enter new tag name..."
          bind:value={newTagName}
        />
        <br />
        <Button on:click={updateTag()}>update tag name</Button>
      </Column>
    </Row>
  </Grid>
</Content>

<style lang="scss">
</style>

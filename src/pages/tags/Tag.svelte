<script lang="ts">
  import { Button, Column, Content, Grid, Row, TextInput } from 'carbon-components-svelte'
  import { apiLayerService } from '../../core'
  import { getContext } from 'svelte'

  const api = apiLayerService
  let context = getContext('tags::getSelectedTag')
  console.log('getSelectedTag: ', context)
  console.log('selectedTag: ', context.getSelectedTag())
  let tags = []

  export let updatedTag: {
    id: string
    name: string
    url: string
    lastUpdatedAt: string
    createdAt: string
  } = {}

  let newTagName: string = ''

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

<script lang="ts">
  import { Button, Column, Content, Grid, Row, Tag, TextInput } from 'carbon-components-svelte'
  import { apiLayerService } from '../../core'
  import { getContext } from 'svelte'

  const api = apiLayerService
  let context = getContext('tags::getSelectedTag')
  console.log('getSelectedTag: ', context)
  console.log('selectedTag: ', context.getSelectedTag())
  let tags = []

  const carbonTagColors: string[] = [
    'red',
    'magenta',
    'purple',
    'blue',
    'cyan',
    'teal',
    'green',
    'gray',
    'cool-gray',
    'warm-gray',
  ]

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
        <Tag type={'green'} />
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

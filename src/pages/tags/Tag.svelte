<script lang="ts">
  import { Button, Column, Content, Grid, Row, Tag, TextInput } from 'carbon-components-svelte'
  import { apiLayerService as api } from '../../core'
  import { getContext, onMount } from 'svelte'
  import { type Writable } from 'svelte/store'

  let selectedTag: Writable<string> = getContext('selectedTag')
  let tag: string = ''

  // const carbonTagColors: string[] = [
  //   'red',
  //   'magenta',
  //   'purple',
  //   'blue',
  //   'cyan',
  //   'teal',
  //   'green',
  //   'gray',
  //   'cool-gray',
  //   'warm-gray',
  // ]

  let newTagName: string = ''

  async function updateTag(tag) {
    await api.renameTag(tag, newTagName)
    selectedTag.set(newTagName)
  }

  onMount(() => {
    console.log('onMount: ')
    const unsubSelectedTag = selectedTag.subscribe((value) => {
      tag = value
      console.log('selectedTag: ', value)
    })

    return () => {
      unsubSelectedTag()
    }
  })
</script>

<Content>
  <Grid>
    <Row>
      <Column>
        <h2>{tag}</h2>
        <Tag type={'green'} title={tag} />
      </Column>
    </Row>
    <Row>
      <Column>
        <TextInput
          inline
          labelText="new tag name"
          placeholder="Enter new tag name..."
          bind:value={newTagName}
        />
        <br />
        <Button on:click={updateTag(tag)}>update tag name</Button>
      </Column>
    </Row>
  </Grid>
</Content>

<style lang="scss">
</style>

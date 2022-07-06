<script lang="ts">
  import { Button, Column, Row } from 'carbon-components-svelte'
  import { apiLayerService } from '../../core'
  const api = apiLayerService
</script>

<Row>
  <Column>
    <h2>Testing API V1</h2>
  </Column>
</Row>
<br />
<Row>
  <Column>
    test
    <br />
    <Button on:click={api.test}>test info</Button>
  </Column>
  <Column>
    get tags
    <br />
    <Button on:click={api.getTags}>get tags</Button>
  </Column>
  <Column>
    get all posts
    <br />
    <Button on:click={api.getAllPosts}>get all posts</Button>
  </Column>
</Row>

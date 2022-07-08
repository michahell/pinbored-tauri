<script lang="ts">
  import { Content, Grid } from 'carbon-components-svelte'
  import { apiLayerService } from '../../core'
  import TestingApiV2 from './TestingApiV2.svelte'
  import TestingApiV1 from './TestingApiV1.svelte'

  const api = apiLayerService
</script>

<Content>
  <Grid>
    <!-- Testing Api V1 -->
    <TestingApiV1 />
    <!-- Testing API V2 -->
    <TestingApiV2 />
  </Grid>
</Content>

<style lang="scss">
</style>

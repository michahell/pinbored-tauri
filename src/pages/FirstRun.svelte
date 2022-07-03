<script lang="ts">
  import { onMount } from 'svelte'
  import { Grid, Row, Column } from 'carbon-components-svelte'
  import { persistenceService } from '../core'
  import { PERSISTED_KEY_FIRST_RUN } from '../core/constants'
  import { Route } from 'tinro'

  onMount(() => {
    persistenceService.set(PERSISTED_KEY_FIRST_RUN, false)
  })
</script>

<Grid>
  <Row>
    <Column>
      <h1>Welcome</h1>
    </Column>
  </Row>
  <Row>
    <Column>
      <section>
        <h1>Pinbored-tauri v0.1</h1>
        <p>
          Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte
          apps.
        </p>
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />da<br />
        da<br />
        da<br />
        da<br />da<br />
        da<br />
        da<br />
        da<br />da<br />
        da<br />
        da<br />
        da<br />da<br />
        da<br />
        da<br />
        da<br />da<br />
        da<br />
        da<br />
        da<br />da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        da<br />
        DRRRRRRRT<br />
        da<br />
      </section>
    </Column>
  </Row>
</Grid>

<style lang="scss">
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>

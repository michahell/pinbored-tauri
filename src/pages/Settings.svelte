<script>
  import {
    Theme,
    RadioButtonGroup,
    RadioButton,
    Grid,
    Row,
    Column,
    Content,
  } from 'carbon-components-svelte'
  import Spacer from '../components/layout/Spacer.svelte'
  import { Route } from 'tinro'
  let theme = 'white'
</script>

<Route path="/settings" breadcrumb="settings">
  <!-- carbon components theme switcher -->
  <Theme bind:theme />
  <!-- some space from top -->
  <Spacer space={'3rem'} />
  <!-- settings -->
  <Content>
    <Grid>
      <Row>
        <Column>
          <h2>Theme</h2>
        </Column>
        <Column>
          <RadioButtonGroup legendText="Carbon theme" bind:selected={theme}>
            {#each ['white', 'g10', 'g80', 'g90', 'g100'] as value}
              <RadioButton labelText={value} {value} />
            {/each}
          </RadioButtonGroup>
        </Column>
      </Row>
      <Row>
        <Column>
          <h2>Nprogress settings</h2>
        </Column>
        <Column />
      </Row>
    </Grid>
  </Content>
</Route>

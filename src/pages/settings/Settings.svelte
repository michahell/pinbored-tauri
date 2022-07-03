<script lang="ts">
  import { Grid, Row, Column, Content } from 'carbon-components-svelte'
  import Spacer from '../../components/layout/Spacer.svelte'
  import ThemeSettings from './ThemeSettings.svelte'
  import AccountSettings from './AccountSettings.svelte'
</script>

<!-- some space from top -->
<Spacer space={'3rem'} />
<!-- settings -->
<Content>
  <Grid>
    <Row>
      <Column>
        <ThemeSettings />
      </Column>
    </Row>
    <Row>
      <Column>
        <AccountSettings />
      </Column>
    </Row>
  </Grid>
</Content>

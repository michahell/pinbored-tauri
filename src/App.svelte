<script lang="ts">
  // app wide stuff
  import 'carbon-components-svelte/css/all.css' // All carbon themes
  // other
  import { Route } from 'tinro' // routing
  import { router } from 'tinro'
  import { persistenceService } from './core'
  import { PERSISTED_KEY_FIRST_RUN } from './core/constants'
  // components

  import Layout from './components/layout/Layout.svelte'
  import FirstRunPage from './pages/FirstRun.svelte'
  import PopularPage from './pages/Popular.svelte'
  import SettingsPage from './pages/Settings.svelte'
  import Collection from './pages/Collection.svelte'

  // setup in-app routing to use in-memory method for history
  router.mode.hash()

  let isFirstRun: boolean
  async function getIsFirstRun() {
    isFirstRun = (await persistenceService.get<boolean>(PERSISTED_KEY_FIRST_RUN)) ?? true
    console.log('isFirstRun? ', isFirstRun)
  }
  getIsFirstRun()
</script>

<Layout>
  <Route path="/*" slot="pages">
    <!-- first run -->
    {#if isFirstRun}
      <FirstRunPage />
    {/if}
    <!-- Popular links / tags -->
    <PopularPage />
    <!-- collection -->
    <Collection />
    <!-- settings -->
    <SettingsPage />
  </Route>
</Layout>

<style lang="scss">
</style>

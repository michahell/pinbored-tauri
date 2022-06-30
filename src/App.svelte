<script lang="ts">
  // app wide stuff
  import 'carbon-components-svelte/css/all.css' // All carbon themes
  // other
  import { Route } from 'tinro' // routing
  import { router } from 'tinro'
  import { persistenceService } from './core'
  import { PERSISTED_KEY_FIRST_RUN } from './core/constants'
  // components
  import SearchBar from './components/Searchbar.svelte'
  import Layout from './components/layout/Layout.svelte'
  import BreadCrumbs from './components/layout/BreadCrumbs.svelte'
  import Navigation from './components/layout/Navigation.svelte'
  import FirstRunPage from './pages/FirstRun.svelte'
  import PopularPage from './pages/Popular.svelte'
  import SettingsPage from './pages/Settings.svelte'

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
  <Route path="/*" slot="subheader">
    <Navigation />
  </Route>

  <Route path="/*" slot="pages">
    <Route path="/" breadcrumb="home" let:meta>
      <!-- first run -->
      <BreadCrumbs breadcrumbs={meta.breadcrumbs} />
      {#if isFirstRun}
        <FirstRunPage />
      {/if}
    </Route>

    <!-- Popular -->
    <Route path="/popular/*" breadcrumb="popular" let:meta>
      <Route path="/">
        <BreadCrumbs breadcrumbs={meta.breadcrumbs} />
        <PopularPage />
      </Route>
      <Route path="/tags" breadcrumb="tags" let:meta>
        <BreadCrumbs breadcrumbs={meta.breadcrumbs} />
        <h1>popular tags</h1>
      </Route>
      <Route path="/links" breadcrumb="links" let:meta>
        <BreadCrumbs breadcrumbs={meta.breadcrumbs} />
        <h1>popular links</h1>
      </Route>
    </Route>

    <!-- collection -->
    <Route path="/collection/*" breadcrumb="collection" let:meta>
      <BreadCrumbs breadcrumbs={meta.breadcrumbs} />
      <SearchBar />
      Collection
    </Route>

    <!-- settings -->
    <Route path="/settings" breadcrumb="settings" let:meta>
      <BreadCrumbs breadcrumbs={meta.breadcrumbs} />
      <SettingsPage />
    </Route>
  </Route>
</Layout>

<style lang="scss">
</style>

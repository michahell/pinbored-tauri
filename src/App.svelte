<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import { readable, writable, get } from 'svelte/store'

  // app wide stuff
  import 'carbon-components-svelte/css/all.css' // All carbon themes

  // other
  import { Route } from 'tinro' // routing
  import { persistenceService } from './core'
  import { PERSISTED_KEY_FIRST_RUN } from './core/constants'
  import bootstrap from './core/bootstrap'

  // components
  import Layout from './components/layout/Layout.svelte'
  import TagSearchBar from './pages/collection/TagSearchBar.svelte'
  import TextSearchBar from './pages/tags/TextSearchBar.svelte'
  import Notifications from './components/notifications/Notifications.svelte'
  import FirstRunPage from './pages/FirstRun.svelte'
  import PopularPage from './pages/Popular.svelte'
  import SettingsPage from './pages/settings/Settings.svelte'
  import CollectionPage from './pages/collection/Collection.svelte'
  import TagsPage from './pages/tags/Tags.svelte'
  import TestingPage from './pages/testing/Testing.svelte'
  import type { Tags } from '../src-api'
  import type { PinboredStore } from './core/types/pinbored.store'

  // main app nested store
  let store = readable<PinboredStore>({
    bootstrapped: writable(false),
    tags: writable<Tags>([]),
    filteredTags: writable<Tags>([]),
  })
  // made available through context
  setContext('store', store)

  let isFirstRun: boolean
  async function getIsFirstRun() {
    isFirstRun = (await persistenceService.get<boolean>(PERSISTED_KEY_FIRST_RUN)) ?? true
    console.log('isFirstRun? ', isFirstRun)
  }

  onMount(async () => {
    await getIsFirstRun()
    await bootstrap()
    get(store).bootstrapped.set(true)
  })
</script>

<!-- Notifications              z-index: 9999; -->
<!-- Nprogress                  z-index: 9000; -->
<!-- carbon components Header   z-index: 8000; -->
<Notifications />

<Layout>
  <Route path="/*" slot="subheader">
    <Route path="/collection">
      <TagSearchBar />
    </Route>
    <Route path="/tags">
      <TextSearchBar />
    </Route>
  </Route>

  <Route path="/*" slot="pages">
    <!-- First run page based off of tauri-plugin-store-api -->
    {#if isFirstRun}
      <Route path="/" breadcrumb="home">
        <FirstRunPage />
      </Route>
    {/if}
    <!-- Testing -->
    <Route path="/testing/*" breadcrumb="testing">
      <TestingPage />
    </Route>
    <!-- Popular links / tags -->
    <Route path="/popular/*" breadcrumb="popular">
      <PopularPage />
    </Route>
    <!-- Collection -->
    <Route path="/collection/*" breadcrumb="collection">
      <CollectionPage />
    </Route>
    <!-- Tags -->
    <Route path="/tags/*" breadcrumb="tags">
      <TagsPage />
    </Route>
    <!-- Settings -->
    <Route path="/settings" breadcrumb="settings">
      <SettingsPage />
    </Route>
  </Route>
</Layout>

<style lang="scss">
</style>

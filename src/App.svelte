<script lang="ts">
  import {Route} from 'tinro';
  import SearchBar from './components/Searchbar.svelte';
  import Layout from './components/layout/Layout.svelte';
  import FirstRunPage from './pages/FirstRun.svelte';
  import PopularPage from './pages/Popular.svelte';
  import SettingsPage from './pages/Settings.svelte';
  // All carbon themes
  import "carbon-components-svelte/css/all.css";
</script>

<Layout>
  <section slot="subheader">

    <Route path="/collection/*">
      <SearchBar/>
    </Route>
  </section>

  <section slot="pages">
    <!-- first run -->
    <Route path="/">
      <FirstRunPage/>
    </Route>

    <!-- Popular -->
    <Route path="/popular/*">
      <Route path="/">
        <PopularPage/>
      </Route>
      <Route path="/tags"><h1>popular tags</h1></Route>
      <Route path="/links"><h1>popular links</h1></Route>
    </Route>

    <!-- collection -->
    <Route path="/collection/*">
      Collection
    </Route>

    <!-- settings -->
    <Route path="/settings">
      <SettingsPage/>
    </Route>
  </section>
</Layout>

<style lang="scss">

</style>

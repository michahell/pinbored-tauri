<script lang="ts">
  import 'agnostic-svelte/css/common.min.css';
  import SearchBar from './components/Searchbar.svelte';
  import TopNav from './components/Topnav.svelte';
  import Footer from './components/Footer.svelte';
  import FirstRunPage from './pages/FirstRunPage.svelte';
  import {Route} from 'tinro';
</script>
<main>
  <section class="nav">
    <TopNav>
      <Route path="/collection/*">
        <SearchBar/>
      </Route>
    </TopNav>
  </section>

  <section class="pages">
    <!-- first run -->
    <Route path="/">
      <FirstRunPage/>
    </Route>
    <!-- Popular -->
    <Route path="/popular/*">
      <Route path="/">
        <h1>Popular links on pinboard currently</h1>
      </Route>
      <Route path="/tags"><h1>popular tags</h1></Route>
      <Route path="/links"><h1>popular links</h1></Route>
    </Route>

    <!-- collection -->
    <Route path="/collection/*">
      Collection
    </Route>
  </section>

  <section class="footer">
    <Footer />
  </section>
</main>
<style>
  :root {
    --agnostic-header-mobile-height: 175px;
    --agnostic-header-color: var(--agnostic-primary);
  }
	main {
		text-align: center;
    padding: 0;
		margin: 0 auto;
    background: black;
    display: flex;
    flex: 1 1 100%;
    flex-direction: column;
    width: 100%;
    height: 100%;
	}
  .nav {
    display: flex;
    flex: 0 0 40px;
    background: hotpink;
  }
  .pages {
    display: flex;
    flex-grow: 1;
    background: palegreen;
    overflow: scroll;
  }
  .footer {
    display: flex;
    flex: 0 0 28px;
    background: lightgoldenrodyellow;
  }
</style>

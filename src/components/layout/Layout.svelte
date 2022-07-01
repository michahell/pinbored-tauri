<script lang="ts">
  import { Route } from 'tinro'
  import PageTransition from './PageTransition.svelte'
  import Footer from './Footer.svelte'
  import Header from './Header.svelte'
  import Spacer from './Spacer.svelte'
  import Navigation from './Navigation.svelte'
  import BreadCrumbs from './BreadCrumbs.svelte'

  // Nprogress bar @ top of page
  import { progressService } from '../../core'
  progressService.set(0.4)
</script>

<Header />
<Spacer space={'3rem'} />

<section class="subheader">
  <Route path="/*">
    <Navigation />
    <BreadCrumbs />
  </Route>
  <!-- context-aware search, tags, etc. etc. -->
  <slot name="subheader">
    <em>no content was provided</em>
  </slot>
</section>

<section class="pages">
  <PageTransition>
    <slot name="pages" />
  </PageTransition>
</section>

<section class="footer">
  <Footer />
</section>

<style lang="scss">
  .subheader {
    background: lightpink;
    display: flex;
    flex-direction: column;
    flex: 1 1 initial;
  }
  .pages {
    display: flex;
    flex-direction: column;
    flex: 1 1 200px;
    background: palegreen;
    overflow: scroll;
  }
  .footer {
    display: flex;
    flex: 0 0 0;
    position: absolute;
    bottom: 0;
  }
</style>

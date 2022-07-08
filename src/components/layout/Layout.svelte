<script lang="ts">
  import { Route } from 'tinro'
  import PageTransition from './PageTransition.svelte'
  import Footer from './Footer.svelte'
  import Header from './Header.svelte'
  import BreadCrumbs from './BreadCrumbs.svelte'
</script>

<!-- header -->
<Header />
<!-- subheader -->
<section class="subheader">
  <Route path="/*">
    <BreadCrumbs />
  </Route>
  <!-- context-aware search, tags, etc. etc. -->
  <slot name="subheader">
    <em>no content was provided</em>
  </slot>
</section>
<!-- pages -->
<section class="pages">
  <PageTransition>
    <slot name="pages" />
  </PageTransition>
</section>
<!-- footer -->
<section class="footer">
  <Footer />
</section>

<style lang="scss">
  .subheader {
    position: relative;
    top: 3rem;
    display: flex;
    flex-direction: column;
    flex: 0 1 auto;
    background: var(--cds-ui-background);
  }
  .pages {
    position: relative;
    top: 3rem;
    display: flex;
    flex-direction: column;
    flex: 1 1 200px;
    overflow: hidden;
    background: var(--cds-ui-background);
  }
  .footer {
    position: absolute;
    bottom: 0;
    display: block;
    width: 100%;
  }
</style>

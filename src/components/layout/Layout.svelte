<script>
  import { Content } from "carbon-components-svelte";
  import PageTransition from './PageTransition.svelte';
  import TopNav from './Topnav.svelte';
  import Footer from './Footer.svelte';
  import Header from './Header.svelte';
  import BreadCrumbs from './BreadCrumbs.svelte';

  // Nprogress bar @ top of page
  import progressService from '../../core/progress.service'
  progressService.set(0.4);
</script>

<Header></Header>
<div class="spacer"></div>

<section class="subheader">
  <BreadCrumbs></BreadCrumbs>
  <TopNav>
    <div>
      <!-- context-aware search, tags, etc. etc. -->
      <slot name="subheader">
        <em>no content was provided</em>
      </slot>
    </div>
  </TopNav>
</section>

<Content>
  <section class="pages">
    <PageTransition>
      <slot name="pages"/>
    </PageTransition>
  </section>

  <section class="footer">
    <Footer />
  </section>
</Content>

<style lang="scss">
  .spacer {
    height: 3rem;
  }
  .subheader {
    background: hotpink;
  }
  .pages {
    height: calc(100% - 5rem);
    background: palegreen;
    overflow: scroll;
  }
  .footer {
    display: flex;
    flex: 0 0 28px;
    background: blueviolet;
  }
</style>
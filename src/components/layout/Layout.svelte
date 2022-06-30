<script lang="ts">
  import { Content } from 'carbon-components-svelte'
  import PageTransition from './PageTransition.svelte'
  import Footer from './Footer.svelte'
  import Header from './Header.svelte'

  // Nprogress bar @ top of page
  import { progressService } from '../../core'
  progressService.set(0.4)
</script>

<Header />
<div class="spacer" />

<section class="subheader">
  <!-- context-aware search, tags, etc. etc. -->
  <slot name="subheader">
    <em>no content was provided</em>
  </slot>
</section>

<!--<Content>-->
<!--</Content>-->

<section class="pages">
  <PageTransition>
    <slot name="pages" />
  </PageTransition>
</section>

<section class="footer">
  <Footer />
</section>

<style lang="scss">
  .spacer {
    height: 3rem;
  }
  .subheader {
    background: lightpink;
  }
  .pages {
    height: calc(100% - 7rem);
    background: palegreen;
    overflow: scroll;
  }
  .footer {
    display: flex;
    flex: 0 0 28px;
    background: blueviolet;
  }
</style>

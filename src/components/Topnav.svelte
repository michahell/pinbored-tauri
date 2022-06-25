<script lang="ts">
  import 'agnostic-svelte/css/common.min.css';
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
  } from 'agnostic-svelte';
  import progressService from '../core/progress.service'
  progressService.set(0.4);
</script>

<section class="app-controls">

  <!-- app progress bar -->


  <!-- main app navigation -->
  <Header isHeaderContentStart="{true}">
    <div slot="logoleft">logo left</div>
    <HeaderNav css="header-flex-fill">
      <HeaderNavItem><a href="/">home</a></HeaderNavItem>
      <HeaderNavItem><a href="/popular">popular</a></HeaderNavItem>
      <HeaderNavItem><a href="/collection">collection</a></HeaderNavItem>
    </HeaderNav>
    <div slot="logoright">logo right</div>
  </Header>

  <!-- additional controls -->
  <slot/>
</section>

<style lang="scss">
  .app-controls {
    width: 100%;
  }
</style>

<script lang="ts">
  import 'agnostic-svelte/css/common.min.css';
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
  } from 'agnostic-svelte';
</script>

<section class="app-controls">

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

<style lang="css">
  @media (min-width: 970px) {
    .header-flex-fill {
      flex-grow: 1;
      margin-inline-start: var(--fluid-16);
    }
  }
  .header-flex-fill {
    margin-inline-start: 0;
    flex-grow: 0;
  }
</style>

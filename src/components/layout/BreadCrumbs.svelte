<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from "carbon-components-svelte";
  import {router, TinroRoute} from 'tinro';

  // update breadcrumbs based in tinro svelte store router:
  export let currentPathSegments: string[] = [];

  router.subscribe((currentRoute: TinroRoute) => {
    console.log('tinro current route: ', currentRoute);
    currentPathSegments = currentRoute.path.split('');
  })
</script>

<section class="breadcrumbs">
  <Breadcrumb>
    <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
    <BreadcrumbItem href="/reports">Annual reports</BreadcrumbItem>
    <BreadcrumbItem href="/reports/2019" isCurrentPage>2019</BreadcrumbItem>
  </Breadcrumb>
</section>

<style lang="scss">
  .breadcrumbs {
    height: 2rem;
  }
</style>
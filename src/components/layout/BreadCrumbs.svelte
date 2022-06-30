<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte'
  import { meta } from 'tinro'

  export let breadcrumbs: { name: string; path: string }[] = []

  // meta().subscribe((currentRoute: any) => {
  //   console.log('tinro current route: ', currentRoute)
  //   breadcrumbs = currentRoute.breadcrumbs
  //   console.log('breadcrumbs: ', breadcrumbs)
  // })
</script>

<section class="breadcrumbs">
  <Breadcrumb>
    {#each breadcrumbs as breadcrumb}
      <BreadcrumbItem href="/{breadcrumb.path}">{breadcrumb.name}</BreadcrumbItem>
    {/each}
  </Breadcrumb>
</section>

<style lang="scss">
  .breadcrumbs {
    background: lightgray;
    height: 2rem;
    width: 100%;
    padding: 8px;
  }
</style>

<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte'
  import { meta } from 'tinro'

  let breadcrumbs: { name: string; path: string }[] = []

  meta().subscribe((currentRoute: any) => {
    console.log('tinro current route: ', currentRoute)
    breadcrumbs = currentRoute.breadcrumbs
    console.log('breadcrumbs: ', breadcrumbs)
  })
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
    display: flex;
    flex: 1 1 2rem;
    background: lightgray;
    padding: 8px;
  }
</style>

<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from 'carbon-components-svelte'
  import { router } from 'tinro'
  import type { TinroRoute } from 'tinro'

  type BreadCrumb = { name: string; url: string }

  let breadcrumbs: BreadCrumb[] = []

  function buildBreadCrumbs(crumbs: string[]): BreadCrumb[] {
    return crumbs.map((crumb, index) => {
      if (index === 0) {
        return {
          name: crumb,
          url: `/${crumb}`,
        }
      } else {
        const url = crumbs.reduce((acc, currCrumb, currIndex) => {
          if (currIndex <= index) {
            return acc + `${currCrumb}/`
          } else {
            return acc
          }
        }, '/')
        return {
          name: crumb,
          url: url,
        }
      }
    })
  }

  router.subscribe((currentRoute: TinroRoute) => {
    const crumbs = currentRoute.path.split('/').filter(Boolean)
    breadcrumbs = buildBreadCrumbs(crumbs)
  })
</script>

<section class="breadcrumbs">
  <Breadcrumb>
    <BreadcrumbItem href="/">home</BreadcrumbItem>
    {#each breadcrumbs as breadcrumb}
      <BreadcrumbItem href={breadcrumb.url}>{breadcrumb.name}</BreadcrumbItem>
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

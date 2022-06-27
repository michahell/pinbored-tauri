<script>
  import { Breadcrumb, BreadcrumbItem } from "carbon-components-svelte";
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
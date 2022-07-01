<script lang="ts">
  import IconTauri from '../svg/IconTauri.svelte'
  import IconTGS from '../svg/IconTGS.svelte'
  import IconSvelte from '../svg/IconSvelte.svelte'
  import IconAgnostic from '../svg/IconAgnostic.svelte'
</script>

<section class="footer">
  <p>
    made by <a target="_blank" href="https://www.thegreenshepherd.nl/">The Green Shepherd</a>
    <IconTGS />
    using <a target="_blank" href="https://tauri.app/">tauri</a>,
    <IconTauri />
    <a target="_blank" href="https://svelte.dev/">svelte</a>,
    <IconSvelte />
    <a target="_blank" href="https://carbon-components-svelte.onrender.com/">carbon components</a>,
    and
    <a target="_blank" href="https://pinboard.in/">pinboard.in</a>
  </p>
</section>

<style lang="scss">
  .footer {
    display: block;
    text-align: right;
    background: rgba(0, 0, 0, 0.2);
    padding: 4px;
    p {
      font-size: 12px;
      vertical-align: text-top;
    }
    a {
      color: darkgreen;
      font-weight: bold;
    }
  }
</style>

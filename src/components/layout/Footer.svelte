<script lang="ts">
  import IconTauri from '../svg/IconTauri.svelte';
  import IconTGS from '../svg/IconTGS.svelte';
  import IconSvelte from '../svg/IconSvelte.svelte';
  import IconAgnostic from '../svg/IconAgnostic.svelte';
</script>

<section class="footer">
  <p>
    made by <a href="https://www.thegreenshepherd.nl/">The Green Shepherd</a> <IconTGS/>
    using <a href="https://tauri.app/">tauri</a> <IconTauri/>
    <a href="https://svelte.dev/">svelte</a> <IconSvelte/>
    <a href="https://www.agnosticui.com/">agnostic-ui</a> <IconAgnostic/>
    and <a href="https://pinboard.in/">pinboard.in</a>
  </p>
</section>

<style lang="scss">
 .footer {
   position: absolute;
   bottom: 0;
   width: 100%;
   text-align: right;
   background-color: #333333;
   color: #666666;
   padding: 2px;

   p {
     font-size: 10px;
     vertical-align: text-top;
   }
 }
</style>

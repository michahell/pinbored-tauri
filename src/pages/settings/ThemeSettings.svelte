<script>
  import { RadioButton, RadioButtonGroup, Theme } from 'carbon-components-svelte'
  let theme = 'white'
</script>

<!-- carbon components theme switcher -->
<Theme bind:theme />

<h2>Theme</h2>
<RadioButtonGroup legendText="Carbon theme" bind:selected={theme}>
  {#each ['white', 'g10', 'g80', 'g90', 'g100'] as value}
    <RadioButton labelText={value} {value} />
  {/each}
</RadioButtonGroup>

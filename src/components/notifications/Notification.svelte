<script lang="ts">
  import { onMount } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { linear } from 'svelte/easing'
  import { ProgressBar, ToastNotification } from 'carbon-components-svelte'

  export let kind: string = 'error'
  export let title: string = 'error'
  export let subtitle: string = 'An internal server error occurred.'
  export let caption: string = new Date().toLocaleString()
  export let flyOutDelay: number = 2500

  const progress = tweened(0, {
    duration: flyOutDelay,
    easing: linear,
  })

  onMount(() => {
    progress.set(flyOutDelay)
  })
</script>

<div class="progress-bar-wrapper">
  <ProgressBar size="sm" hideLabel value={$progress} max={flyOutDelay} />
</div>
<ToastNotification lowContrast {kind} timeout={flyOutDelay + 100}>
  <strong slot="title">{title}</strong>
  <strong slot="subtitle">{subtitle}</strong>
  <strong slot="caption">{caption}</strong>
</ToastNotification>

<style lang="scss">
  .progress-bar-wrapper {
    position: relative;
    top: 0.5rem;
    margin-right: 1rem;
  }
</style>

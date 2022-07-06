<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { notificationsStore } from '../../core/notifications.store'
  import { SVELTE_STORE_KEY_NOTIFICATIONS } from '../../core/constants'
  import type { PinboardNotification } from '../../core/types/notification.interface'
  import Notification from './Notification.svelte'

  setContext(SVELTE_STORE_KEY_NOTIFICATIONS, notificationsStore)

  const flyOutDelay = 2500
  let notifications: PinboardNotification[] = []

  onMount(() => {
    notificationsStore.subscribe((storeNotifications: PinboardNotification[]) => {
      notifications = storeNotifications
    })
  })
</script>

<section class="notifications">
  {#each notifications as { kind, title, subtitle, caption, id } (id)}
    <div in:fade out:fly={{ delay: flyOutDelay, x: 175 }}>
      <Notification {kind} {title} {subtitle} {caption} {flyOutDelay} />
    </div>
  {/each}
</section>

<style lang="scss">
  $notifications-bar-width: 150px;
  $notifications-bar-padding: 8px;

  .notifications {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    margin-top: 3rem;
    display: block;
    z-index: 9999;
  }
</style>

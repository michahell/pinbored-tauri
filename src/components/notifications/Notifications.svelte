<script lang="ts">
  import { ToastNotification } from 'carbon-components-svelte'
  import { notificationsStore } from '../../core/notifications.store'
  import { onMount, setContext } from 'svelte'
  import { SVELTE_STORE_KEY_NOTIFICATIONS } from '../../core/constants'
  import { nanoid } from 'nanoid'
  import type { PinboardNotification } from '../../core/types/notification.interface'

  setContext(SVELTE_STORE_KEY_NOTIFICATIONS, notificationsStore)

  let notifications: PinboardNotification[] = []

  onMount(() => {
    notificationsStore.add({
      id: nanoid(),
      kind: 'error',
      title: 'error fetching tags',
      subtitle: 'subtitle',
      caption: 'caption suckaa',
    })

    notificationsStore.subscribe((storeNotifications: PinboardNotification[]) => {
      notifications = storeNotifications
    })
  })
</script>

<section class="notifications">
  {#each notifications as notification (notification.id)}
    <ToastNotification
      lowContrast
      kind={notification.kind || 'error'}
      title={notification.title || 'error'}
      subtitle={notification.title || 'An internal server error occurred.'}
      caption={notification.caption || new Date().toLocaleString()}
    />
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

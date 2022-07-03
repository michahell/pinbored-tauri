<script lang="ts">
  import { TextInput } from 'carbon-components-svelte'
  import { persistenceService } from '../../core'
  import {
    PERSISTED_KEY_PINBOARD_TOKEN,
    PERSISTED_KEY_PINBOARD_USERNAME,
  } from '../../core/constants'
  import { onMount } from 'svelte'

  function updateToken(event) {
    persistenceService.set(PERSISTED_KEY_PINBOARD_TOKEN, event.detail)
    token = event.detail
  }
  function updateUsername(event) {
    persistenceService.set(PERSISTED_KEY_PINBOARD_USERNAME, event.detail)
    username = event.detail
  }

  let token: string = ''
  let username: string = ''

  onMount(async () => {
    token = await persistenceService.get(PERSISTED_KEY_PINBOARD_TOKEN)
    username = await persistenceService.get(PERSISTED_KEY_PINBOARD_USERNAME)
  })
</script>

<h2>account</h2>
<TextInput
  inline
  labelText="username"
  placeholder="username"
  value={username}
  on:change={updateUsername}
/>
<TextInput inline labelText="token" placeholder="token" value={token} on:change={updateToken} />

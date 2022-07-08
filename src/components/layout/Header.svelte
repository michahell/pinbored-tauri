<script>
  import {
    Header,
    HeaderUtilities,
    HeaderAction,
    HeaderGlobalAction,
    HeaderPanelLinks,
    HeaderPanelDivider,
    HeaderPanelLink,
    HeaderSearch,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
  } from 'carbon-components-svelte'
  import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte'
  import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte'

  // Carbon UI shell related
  let isOpen1 = false
  let isOpen2 = false

  // router stuff
  import { router } from 'tinro'

  function goToSettings() {
    router.goto('/settings')
  }

  // header search

  const data = [
    {
      href: '/',
      text: 'Kubernetes Service',
      description:
        'Deploy secure, highly available apps in a native Kubernetes experience. IBM Cloud Kubernetes Service creates a cluster of compute hosts and deploys highly available containers.',
    },
    {
      href: '/',
      text: 'Red Hat OpenShift on IBM Cloud',
      description:
        'Deploy and secure enterprise workloads on native OpenShift with developer focused tools to run highly available apps. OpenShift clusters build on Kubernetes container orchestration that offers consistency and flexibility in operations.',
    },
    {
      href: '/',
      text: 'Container Registry',
      description:
        'Securely store container images and monitor their vulnerabilities in a private registry.',
    },
    {
      href: '/',
      text: 'Code Engine',
      description: 'Run your application, job, or container on a managed serverless platform.',
    },
  ]

  let ref = null
  let active = false
  let value = ''
  let selectedResultIndex = 0
  let events = []

  $: lowerCaseValue = value.toLowerCase()
  $: results =
    value.length > 0
      ? data.filter((item) => {
          return (
            item.text.toLowerCase().includes(lowerCaseValue) ||
            item.description.includes(lowerCaseValue)
          )
        })
      : []
</script>

<Header company="pinbored-tauri" platformName="v0.1" uiShellAriaLabel="header">
  <HeaderNav>
    <HeaderNavItem href="/tags" text="tags" />
    <HeaderNavItem href="/collection" text="collection" />
    <HeaderNavItem href="/testing" text="testing" />
    <HeaderNavMenu text="popular">
      <HeaderNavItem href="/popular/links" text="links" />
      <HeaderNavItem href="/popular/tags" text="tags" />
      <HeaderNavItem href="/popular/notes" text="notes" />
    </HeaderNavMenu>
    <HeaderNavItem href="/settings" text="settings" />
  </HeaderNav>
  <HeaderUtilities>
    <HeaderSearch
      bind:ref
      bind:active
      bind:value
      bind:selectedResultIndex
      placeholder="Search services"
      {results}
      on:active={() => {
        events = [...events, { type: 'active' }]
      }}
      on:inactive={() => {
        events = [...events, { type: 'inactive' }]
      }}
      on:clear={() => {
        events = [...events, { type: 'clear' }]
      }}
      on:select={(e) => {
        events = [...events, { type: 'select', ...e.detail }]
      }}
    />

    <HeaderGlobalAction aria-label="Settings" icon={SettingsAdjust} on:click={goToSettings} />
    <HeaderAction bind:isOpen={isOpen1} icon={UserAvatarFilledAlt} closeIcon={UserAvatarFilledAlt}>
      <HeaderPanelLinks>
        <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
        <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
        <HeaderPanelDivider>Switcher subject 3</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
    <HeaderAction bind:isOpen={isOpen2}>
      <HeaderPanelLinks>
        <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
        <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 5</HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
</Header>

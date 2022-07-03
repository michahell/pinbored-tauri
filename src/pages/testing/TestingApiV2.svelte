<script lang="ts">
  import { Button, Column, Row, TextInput } from 'carbon-components-svelte'
  import { apiLayerService } from '../../core'

  let createdTestUser: any
  let newTestUserName: string
  let testUserName: string
  let testUserPassword: string

  const api = apiLayerService
</script>

<Row>
  <Column>
    <h2>Testing API V2</h2>
  </Column>
</Row>
<br />
<Row>
  <Column>
    create test user with name: <br /> <br />
    <TextInput
      inline
      labelText="new test username"
      placeholder="Enter new test username..."
      bind:value={newTestUserName}
    />
    <br />
    <Button on:click={api.createTestUser(newTestUserName)}>create new test user</Button>
  </Column>
</Row>
<br />
<Row>
  <Column>
    testUser: <br />
    {createdTestUser}
  </Column>
</Row>
<br />
<Row>
  <Column>
    authenticate with test user above: <br /><br />
    <TextInput
      bind:value={testUserName}
      inline
      labelText="test username"
      placeholder="Enter test username..."
    />
    <br />
    <TextInput
      bind:value={testUserPassword}
      inline
      labelText="test password"
      placeholder="Enter test password..."
    />
    <br />
    <Button on:click={authenticateTestUser(testUserName, testUserPassword)}
      >authenticate test user</Button
    >
  </Column>
</Row>

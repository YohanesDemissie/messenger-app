import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown } from 'semantic-ui-react';

class UserPanel extends Component {
  dropDownOptions = () => [
    {
      key: 'user',
      text: <span>Signed in as <strong>User</strong></span>,
      disabled: true,
    },
    {
      key: 'avatar',
      text: <span>Change Avatar</span>
    },
    {
      key: 'signout',
      text: <span>Sign Out</span>
    }
  ]

  render() {
    return(
      <Grid style={{background: "#4c3c4c"}}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.23m", margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code"/>
              <Header.Content>
                DevChat App
              </Header.Content>
            </Header>
          </Grid.Row>
          <Header style={{ padding:"0.25em"}} as="h4" inverted>
            <Dropdown trigger={
              <span>User</span>
            } options={this.dropDownOptions()}/>
          </Header>
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel;
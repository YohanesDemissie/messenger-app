import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';

class DirectMessages extends Component {
  state = {
    users: [],
  }
  render() {
    const { users } = this.state
    return(
      <Menu.Menu>
        <Menu.Item>
          <span>
            <Icon name="mail" /> Direct Messages
          </span>{' '}
          ({ users.length })
        </Menu.Item>
        {/* Users to Send Direct Messages */}
      </Menu.Menu>
    )
  }
}

export default DirectMessages;
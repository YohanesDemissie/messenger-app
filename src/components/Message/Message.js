import React, { Component } from 'react';
import { Segment, Comment} from 'semantic-ui-react';

class Message extends Component {
  render() {
    return (
      <React.Fragment>
        <MessegesHeader />

        <Segment>
          <Comment.Group className="messages">
          </Comment.Group>
        </Segment>

        <MessageForm />
      </React.Fragment>
    )
  }
}

export default Message;
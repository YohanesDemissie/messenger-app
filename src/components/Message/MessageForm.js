import React, { Component } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase';
import FileModal from './FileModal';

class MessageForm extends Component {
  state = {
    message: '',
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false
  }

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = event => { //used to handle prop change in message input
    this.setState({ [event.target.name]: event.target.value })
  }

  createMessage = () => {
    const message = {
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      content: this.state.message
    }
    return message;
  }

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true});
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: []})
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          })
        })
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a messages'})
      })
    }
  }

  render() {
    const { errors, message, loading, modal } = this.state //passing in error for sending empty string message, passing message... for obvious reasons, and loading to false, temporary, when message is sent so button isn't accidentally pressed twice
    return(
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={'add'} />}
          labelPosition="left"
          className={
            errors.some(error => error.message.includes('message')) ? 'error' : ''
          }
          placeholder="write your message"
        />
        <Button.Group icon width="2">
          <Button
            onClick={this.sendMessage}
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            onClick={this.openModal}
            content="upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
          <FileModal 
            modal={modal}
            closeModal={this.closeModal}
          />
        </Button.Group>
        MessageForm Page
      </Segment>
    )
  }
}

export default MessageForm;
import React, { Component, Fragment } from 'react';
import firebase from '../../firebase';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'), //ARBITRARY FROM FIREBASE DOCUMENTATIONS. .ref() TEXT CREATED IN REFERENCE TO
    modal: false
  }

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    const key = channelsRef.push().key; //takes channel ref, use the push mehtod, get the key property which should give us a unique identifier for every new channel created

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL

      }
    }

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetails: ''});
        this.closeModal();
        console.log('channel added', channelName)
      })
      .catch(error => {
        console.error(error)
      })
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  }

  //UPDATE THE STATE OBJECT ACCORDING TO THE NAME PROPERTY OF THE INPUT THE USER IS TYPING IN
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value}) //event being the argument, targeting the name, giving a new value based on use input
  }

  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails //making sure there are values for channelName and channelDetails

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ modal: false })

  render() {
    const { channels, modal } = this.state
    return(
      <Fragment>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span>
              <Icon name='exchange' /> Channels
            </span> {" "}
            ({ channels.length }) <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
        </Menu.Menu>
          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Add a channel</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <Input
                    fluid
                    label="Name of Channel"
                    name="channelName"
                    onChange={this.handleChange}
                  />
                </Form.Field>

                <Form.Field>
                  <Input
                    fluid
                    label="About the Channel"
                    name="channelDetails"
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Form>
            </Modal.Content>

            <Modal.Actions>
              <Button color="green" inverted onClick={this.handleSubmit}>
                <Icon name="checkmark" /> Add
              </Button>

              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Fragment>
    )
  }
}

export default Channels
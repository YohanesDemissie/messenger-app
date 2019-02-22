import React, { Component, Fragment } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends Component {
  state = {
    channels: [],
    channelName: '',
    channelDetails: '',
    modal: false
  }

  //UPDATE THE STATE OBJECT ACCORDING TO THE NAME PROPERTY OF THE INPUT THE USER IS TYPING IN
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value}) //event being the argument, targeting the name, giving a new value based on use input
  }

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
              <Form>
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
              <Button color="green" inverted>
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
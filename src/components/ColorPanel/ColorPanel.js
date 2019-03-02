import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Label, Modal, Icon, Segment } from 'semantic-ui-react';
//import { StarterPicker } from 'react-color'; //REALLY COOL CUSTOM THEME MAKER UI FOR THE USER!!! APPLIED IN MODEM.CONTENT TAGS BELOW
import { HuePicker } from 'react-color';

class ColorPanel extends Component {
  state = {
    modal: false,
  };

  openModal = () => this.setState({ modal: true});

  closeModal = () => this.setState({ modal: false });


  render() {
    const { modal } = this.state;
    return(
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        vertical
        visible
        width="very thin"
      >
        <Divider />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Change Color Theme</Modal.Header>
          <Modal.Content>
            <Segment>
              <Label content="Primary Color" />
              <HuePicker />
            </Segment>
            <Segment>
              <Label content="Secondary Color" />
              <HuePicker />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted>
              <Icon name="checkmark" />Save Colors
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" />cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    )
  }
}

export default ColorPanel;
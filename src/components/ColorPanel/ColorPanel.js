import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Label, Modal, Icon, Segment } from 'semantic-ui-react';
//import { StarterPicker } from 'react-color'; //REALLY COOL CUSTOM THEME MAKER UI FOR THE USER!!! APPLIED IN MODEM.CONTENT TAGS BELOW
import { HuePicker } from 'react-color';
import firebase from '../../firebase';

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: '',
    secondary: '',
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
  };

  handleChangePrimary = color => this.setState({ primary: color.hex}); //read 'react-color' docs for ind-depth look at method. adding primary colors to state using hex code

  handleChangeSecondary = color => this.setState({ secondary: color.hex }); //read 'react-color' docs for ind-depth look at method. 

  handleSavedColors = () => {
    if(this.state.primary && this.state.secondary) {
      this.saveColors(this.state.primary, this.state.secondary);
    }
  }

  saveColors = (primary, secondary) => {
    this.state.usersRef
      .child(`${this.state.user.uid}/colors`)
      .push() //push unique identifier on 'colors' of user pick
      .update({ //update new color hex code primary, secondary
        primary, secondary
      })
      .then(() => {
        console.log('colors added'); 
        this.closeModal();
      })
      .catch(err => console.error(err));
  }

  openModal = () => this.setState({ modal: true});

  closeModal = () => this.setState({ modal: false });


  render() {
    const { modal, primary, secondary } = this.state; //passing down state through ui, displaying users choice of colors
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
            <Segment inverted>
              <Label content="Primary Color" />
              <HuePicker color={primary} onChange={this.handleChangePrimary} width='100%'/>
            </Segment>
            <Segment inverted>
              <Label content="Secondary Color" />
              <HuePicker color={secondary} onChange={this.handleChangeSecondary} width='100%'/>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSavedColors}>
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
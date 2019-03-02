import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Label } from 'semantic-ui-react'

class ColorPanel extends Component {
  state = {
    modal: false,
  }

  openModal = () => this.setState({ modal: true});

  closeModal = () => this.setState({ modal: false });


  render() {
    return(
      <Sidebar
        as={Menu}
        icon="labeled"
        inverted
        visible
        width="very thin"
        // ColorPanel
      >
      <Divider />
      <Button icon="add" size="small" color="blue" onClick={this.openModal} />
      {/* color picker Modal*/}
      </Sidebar>
    )
  }
}

export default ColorPanel;
import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false
  }

  openModal = () => this.setState({ modal: true})

  closeModal = () => this.setState({ modal: true })


  dropDownOptions = () => [
    {
      key: 'user',
      text: (
      <span>
        Signed in as<strong>{this.state.user.displayName}</strong>
      </span>
      ),
      disabled: true,
    },
    {
      key: 'avatar',
      text: <span onClick={this.openModal}>Change Avatar</span>
    },
    {
      key: 'signOut',
      text: <span onClick={this.handleSignOut}>Sign Out</span>
    }
  ];

  handleSignOut = () => { //meat and potatos for sign out helper function using firebase
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed out!'))
  }

  render() {
    const { user, modal } = this.state;
    const { primaryColor } = this.props;
    // console.log(this.props.currentUser);
    return(
      <Grid style={{background: primaryColor}}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.23m", margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code"/>
              <Header.Content>
                DevChat App
              </Header.Content>
            </Header>
            <Header style={{ padding:"0.25em"}} as="h4" inverted>
              <Dropdown trigger={
                <span>
                <Image src={user.photoURL} spaced="right" avatar />
                {user.displayName}</span>
              } options={this.dropDownOptions()}/>
            </Header>
          </Grid.Row>

          {/* change user avatar modal */}
          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input 
                fluid
                type="file"
                label="New Avatar"
                name="previewImage"
              />
              <Grid centered stackable columns={2}>
                <Grid.Row cetnered>
                  <Grid.Column className="ui center aligned grid">
                    {/* Image Preview */}
                  </Grid.Column>
                  <Grid.Column>
                    {/* Cropped Image Preview */}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              <Button color="green" inverted>
                <Icon name="save" /> Change Avatar
              </Button>
              <Button color="green" inverted>
                <Icon name="image" /> Preview
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    )
  }
}



export default UserPanel;
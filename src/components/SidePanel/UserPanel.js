import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor'; //used to crop image of avatar

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob:'',
    uploadedCroppedImage: '',
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref('users'),
    metadata: {
      contentType: 'image/jpeg',
    }
  }

  openModal = () => this.setState({ modal: true})

  closeModal = () => this.setState({ modal: false })


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

  uploadCroppedImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state;
    storageRef
    .child(`avatar/users/${userRef.uid}`) //first we are going to grab the current users uid...
    .put(blob, metadata) //applying restful api 'put' method to put our image in the firebase storage. also passing in meta data for additional info on content
    .then(snap => {
      snap.ref.getDownloadURL().then(downloadURL => { //get the snap back after uploading the image and on the ref property, execute the getDownloadURL method
        this.setState({ uploadedCroppedImage: downloadURL}, () => this.changeAvatar()); //then get the download URL from firebas storage and set the following properties with the download url
      });
    });
  };

  changeAvatar = () => {
    this.state.userRef //grab userRef from state...
      .updateProfile({ //apply .updateProfile method to update photoURL property...
        photoURL: this.state.uploadedCroppedImage //update the property using the uploadedCroppedImage function
      })
      .then(() => { //making a promise with a console log upon firing correctly
        console.log('photoUrl updtaed');
        this.closeModal();
      })
      .catch(err => {
        console.error(err);
      })
      this.state.usersRef
        .child(this.state.user.uid) //grab current user id
        .update({ avatar: this.state.uploadedCroppedImage }) //update the avatar property with croppedImage function
        .then(() => { //making a promise to console.log upon firing correctly
          console.log('user avatare updated')
        })
        .catch(err => {
          console.error(err)
        })
  }

  handleChange = event => { //take in event...
    const file = event.target.files[0]; //grab first index of array called file
    const reader = new FileReader() //use file reader api to 

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  handleCropImage = () => {
    if (this.avatarEditor) { //if we have this reference...
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => { // use .getImageScaledToCanvas() method to crop our image and use the .toBlob method to convert it to an image blob...
        let imageUrl = URL.createObjectURL(blob); //create an image url using .creatObjectURL method passing in our image 'blob'...
        this.setState({ //set our image url to our cropped image property passing blob to its own property using state
          croppedImage: imageUrl,
          blob
        });
      });
    }
  }

  handleSignOut = () => { //meat and potatos for sign out helper function using firebase
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed out!'))
  }

  render() {
    const { user, modal, previewImage, croppedImage } = this.state;
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
                onChange={this.handleChange}
                fluid
                type="file"
                label="New Avatar"
                name="previewImage"
              />
              <Grid centered stackable columns={2}>
                <Grid.Row cetnered>
                  <Grid.Column className="ui center aligned grid">
                    {previewImage && (  /* when/if previewImage() is called... */
                      <AvatarEditor
                      ref={node => (this.avatarEditor = node)}
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage && ( /* IF/WHEN cropped image is called, we will render the image element below... */
                      <Image
                        style={{ margin: '3.5em auto'}}
                        width={100}
                        height={100}
                        src={croppedImage}
                      />

                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage &&
              <Button color="green" inverted onClick={this.uploadCroppedImage}>
                <Icon name="save" /> Change Avatar
              </Button>}
              <Button color="green" inverted onClick={this.handleCropImage}>
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
import React, { Component, Fragment } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends Component {
  state = {
    activeChannel: '',
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'), //ARBITRARY FROM FIREBASE DOCUMENTATIONS. .ref() TEXT CREATED IN REFERENCE TO
    modal: false,
    firstLoad: true
  }

  componentDidMount() {
    this.addListeners()
  }

  componentWillUnmount() { //
    this.removeListeners();
  }

  addListeners = () => { //Section 7, Lecture 23 for more in depth clarity
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', snap => { //listens to every new child added
      loadedChannels.push(snap.val()); //push the value of each snap to values array
      console.log(loadedChannels);
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel()) //set the channels part of state to loadedChannels
    });
  };

  removeListeners = () => {
    this.state.channelsRef.off(); //turns off event listeners for events that aren't going to happens the user navigates through the app
  }

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0]; //takes first index of array of channels as default channel on page load
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel); //by default displays channel that is currently active
    }
    this.setState({ firstLoad: false })
  };

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
      });
  };

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

  changeChannel = channel => {
    this.setActiveChannel(channel) //pass in changed  channel to pass in active channel
    this.props.setCurrentChannel(channel) //takes the channel and puts it in global state
    this.props.setPrivateChannel(false)
  }

  setActiveChannel = channel => {
    this.setState ({ activeChannel: channel.id})
  }

  displayChannels = channels =>
    channels.length > 0 && channels.map(channel => ( //making sure channels length is greater than 0 & mapping through array of channels
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{opacity: 0.7 }}
        active={channel.id === this.state.activeChannel } //checks if there is an active channel and highlights it
      >
        # {channel.name}
      </Menu.Item>
    ));


  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails //making sure there are values for channelName and channelDetails

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ modal: false })

  render() {
    const { channels, modal } = this.state
    return(
      <Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name='exchange' /> Channels
            </span> {" "}
            ({ channels.length }) <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
          {this.displayChannels(channels)}
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

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels)
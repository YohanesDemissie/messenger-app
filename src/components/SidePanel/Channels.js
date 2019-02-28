import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label
} from "semantic-ui-react";

class Channels extends React.Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    channel: null,
    channels: [],
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    messagesRef: firebase.database().ref("messages"),
    notifications: [],
    modal: false,
    firstLoad: true
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on("value", snap => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      notification => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({ notifications });
  };

  removeListeners = () => {
    this.state.channelsRef.off();
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    this.setState({ firstLoad: false });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
        console.log("channel added");
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color="red">{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  render() {
    const { channels, modal } = this.state;

    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>

        {/* Add Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
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
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(Channels);


// import React, { Component, Fragment } from 'react';
// import firebase from '../../firebase';
// import { connect } from 'react-redux';
// import { setCurrentChannel, setPrivateChannel } from '../../actions';
// import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';

// class Channels extends Component {
//   state = {
//     activeChannel: '',
//     user: this.props.currentUser,
//     channel: null,
//     channels: [],
//     channelName: '',
//     channelDetails: '',
//     channelsRef: firebase.database().ref('channels'), //ARBITRARY FROM FIREBASE DOCUMENTATIONS. .ref() TEXT CREATED IN REFERENCE TO
//     messagesRef: firebase.database().ref('messages'),
//     notifications: [],
//     modal: false,
//     firstLoad: true
//   }

//   componentDidMount() {
//     this.addListeners();
//   }

//   componentWillUnmount() { 
//     this.removeListeners();
//   }

//   addListeners = () => { //Section 7, Lecture 23 for more in depth clarity
//     let loadedChannels = [];
//     this.state.channelsRef.on('child_added', snap => { //listens to every new child added
//       loadedChannels.push(snap.val()); //push the value of each snap to values array
//       console.log(loadedChannels);
//       this.setState({ channels: loadedChannels }, () => this.setFirstChannel()) //set the channels part of state to loadedChannels
//       this.addNotificationListener(snap.key); //this will take the id of every channel thats added to the channels ref with sanp.key
//     });
//   };

//   addNotificationListener = channelId => { //will accept snap.key as chanel id
//     this.state.messagesRef.child(channelId).on('value', snap => { //take the messagesRef, put channel Id as a child on it and listen to any value changes(aka new messages to any of our channels)
//       if (this.state.channel) { //if we have any value to the channel state, and the user is on a different channel
//         this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap); //display number of messages that are new via handleNotifications. This will take channelId, Id of current channel in state, notifications in state and the entire snap
//       }
//     })
//   }

//   handleNotifications = (channelId, currentChannelId, notifications, snap) => {
//     let lastTotal = 0;
//     let index = notifications.findIndex(notification => notification.id === channelId); //itereate notification array we are getting from state using .findIndex to find index value for array element through notifidations array which has a id property = to channel Id

//     if (index !== -1) { //if we do get a value, make sure its not equal to current channel ID
//       if (channelId !== currentChannelId) {
//         lastTotal = notifications[index].total; //updates the last total value using .total

//         if (snap.numChildren() - lastTotal > 0) { //updates the count property for total # of messages outside of current channel.
//           notifications[index].count = snap.numChildren() - lastTotal;
//         }
// ;      }
// notifications[index].lastKnownTotal = snap.numChildren()
//     } else {
//       notifications.push({
//         id: channelId,
//         total: snap.numChildren(),
//         lastKnownTotal: snap.numChildren(), //gives us the amount of notifications
//         count: 0
//       })
//     }
//     this.setState({ notifications }); //updates total value to state
//   }

//   removeListeners = () => {
//     this.state.channelsRef.off(); //turns off event listeners for events that aren't going to happens the user navigates through the app
//   }

//   setFirstChannel = () => {
//     const firstChannel = this.state.channels[0]; //takes first index of array of channels as default channel on page load
//     if (this.state.firstLoad && this.state.channels.length > 0) {
//       this.props.setCurrentChannel(firstChannel);
//       this.setActiveChannel(firstChannel); //by default displays channel that is currently active
//       this.setState({ channel: firstChannel }); //gives us notifications for all channels
//     }
//     this.setState({ firstLoad: false })
//   };

//   addChannel = () => {
//     const { channelsRef, channelName, channelDetails, user } = this.state;

//     const key = channelsRef.push().key; //takes channel ref, use the push mehtod, get the key property which should give us a unique identifier for every new channel created

//     const newChannel = {
//       id: key,
//       name: channelName,
//       details: channelDetails,
//       createdBy: {
//         name: user.displayName,
//         avatar: user.photoURL
//       }
//     }

//     channelsRef
//       .child(key)
//       .update(newChannel)
//       .then(() => {
//         this.setState({ channelName: '', channelDetails: ''});
//         this.closeModal();
//         console.log('channel added', channelName)
//       })
//       .catch(error => {
//         console.error(error)
//       });
//   };

//   handleSubmit = event => {
//     event.preventDefault();
//     if (this.isFormValid(this.state)) {
//       this.addChannel();
//     }
//   }

//   //UPDATE THE STATE OBJECT ACCORDING TO THE NAME PROPERTY OF THE INPUT THE USER IS TYPING IN
//   handleChange = event => {
//     this.setState({ [event.target.name]: event.target.value}) //event being the argument, targeting the name, giving a new value based on use input
//   }

//   changeChannel = channel => {
//     this.setActiveChannel(channel) //pass in changed  channel to pass in active channel
//     this.clearNotifications();
//     this.props.setCurrentChannel(channel) //takes the channel and puts it in global state
//     this.props.setPrivateChannel(false)
//     this.setState({ channel });
//   }

//   clearNotifications = () => { //will remove notifications for channel we are currently on
//     let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id); //iterate over notifications array, check if id is same as current channel/notification id

//     if (index !== -1) { //if the value is positive (ie: new notifications)
//       let updatedNotifications = [...this.state.notifications]; //copy notification array in state and set up to updatedNotifications variabble
//       updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal; //grab total value of elements in array and updates based off last known total property
//       updatedNotifications[index].count = 0; //setting count to 0
//       this.setState({ notifications: updatedNotifications }) //set  new notifications to state
//     }
//   }

//   setActiveChannel = channel => {
//     this.setState ({ activeChannel: channel.id})
//   }

//   getNotificationCount = channel => { //takes channel to iterate over.
//     let count = 0; //setting count variable initially to 0
//     this.state.notifications.forEach(notification => { //iterate thorugh notifications array in state using .forEach()
//       if (notification.id === channel.id) { //if id element = channel id
//         count = notification.count; //update count variable
//       }
//     })

//     if (count > 0) return count; //return that numbber as new messages as long as it is greater than 0
//   }

//   displayChannels = channels =>
//     channels.length > 0 && channels.map(channel => ( //making sure channels length is greater than 0 & mapping through array of channels
//       <Menu.Item
//         key={channel.id}
//         onClick={() => this.changeChannel(channel)}
//         name={channel.name}
//         style={{opacity: 0.7 }}
//         active={channel.id === this.state.activeChannel } //checks if there is an active channel and highlights it
//       >
//         {this.getNotificationCount(channel) && ( //if value is true or truthy, display red notification and number of new messages with GetNotificationCount
//           <Label color="red">{this.getNotificationCount(channel)}</Label>
//         )}
//         # {channel.name}
//       </Menu.Item>
//     ));


//   isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails //making sure there are values for channelName and channelDetails

//   openModal = () => this.setState({ modal: true })

//   closeModal = () => this.setState({ modal: false })

//   render() {
//     const { channels, modal } = this.state
//     return(
//       <Fragment>
//         <Menu.Menu className="menu">
//           <Menu.Item>
//             <span>
//               <Icon name='exchange' /> Channels
//             </span> {" "}
//             ({ channels.length }) <Icon name="add" onClick={this.openModal}/>
//           </Menu.Item>
//           {this.displayChannels(channels)}
//         </Menu.Menu>
//           <Modal basic open={modal} onClose={this.closeModal}>
//             <Modal.Header>Add a channel</Modal.Header>
//             <Modal.Content>
//               <Form onSubmit={this.handleSubmit}>
//                 <Form.Field>
//                   <Input
//                     fluid
//                     label="Name of Channel"
//                     name="channelName"
//                     onChange={this.handleChange}
//                   />
//                 </Form.Field>

//                 <Form.Field>
//                   <Input
//                     fluid
//                     label="About the Channel"
//                     name="channelDetails"
//                     onChange={this.handleChange}
//                   />
//                 </Form.Field>
//               </Form>
//             </Modal.Content>

//             <Modal.Actions>
//               <Button color="green" inverted onClick={this.handleSubmit}>
//                 <Icon name="checkmark" /> Add
//               </Button>

//               <Button color="red" inverted onClick={this.closeModal}>
//                 <Icon name="remove" /> Cancel
//               </Button>
//             </Modal.Actions>
//           </Modal>
//         </Fragment>
//     )
//   }
// }

// export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels)
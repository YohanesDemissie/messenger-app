import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon } from 'semantic-ui-react';

class Starred extends Component {
  state = {
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
    activeChannel: '',
    starredChannels: []
  }

  componentDidMount() {
    if (this.state.user) { //if we have a user in state (ie if user is logged in)
      this.addListeners(this.state.user.uid); //pass in the users id
    }
  }

  componentWillUnmount() {
    this.removeListener()
  }

  removeListener = () => {
    this.state.usersRef.child(`${this.state.user.uid}/starred`).off();
  }

  addListeners = userId => {
    this.state.usersRef
      .child(userId)
      .child('starred') //select starred reference which is a child of user id
      .on('child_added', snap => { //when user stars channel, listen for channel added event
        const starredChannel = { id: snap.key, ...snap.val() }; //
        this.setState({ //create a new array taking all preivious values of starred channels
          starredChannels: [...this.state.starredChannels, starredChannel] //and adding it to starred channels
        });
      });
      this.state.usersRef
        .child(userId)
        .child('starred')
        .on('child_removed', snap => {
          const channelToRemove = { id: snap.key, ...snap.val() };
          const filteredChannels = this.state.starredChannels.filter(channel => {
            return channel.id !== channelToRemove.id;
          })
          this.setState({ starredChannels: filteredChannels})
        })
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  displayChannels = starredChannels =>
    starredChannels.length > 0 &&
    starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  render() {
    const { starredChannels } = this.state;
    return(
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star" /> Starred
            </span>{" "}
          ({starredChannels.length})
        </Menu.Item>
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    )
  }
}

export default connect(null, {setCurrentChannel, setPrivateChannel})(Starred);
import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { Menu, Icon, MenuItem } from 'semantic-ui-react';

class DirectMessages extends Component {
  state = {
    user: this.props.currentUser,
    users: [],
    usersRef: firebase.database().ref('user'),
    connectedRef: firebase.database().ref('.info/connected'), //well let us know if users are connected or not
    presenceRef: firebase.database().ref('presence') //an obbject that checks if users are true or false in reference to being connected/online or not
  }

  componentDidMount() {
    if(this.state.user) { //pass listener to user id if user is present in direct messages component
      this.addListeners(this.state.user.uid);
    }
  }

  addListeners = currentUserUid => {
    let loadedUsers = [];
    this.state.usersRef.on('child_added', snap => { //listen for any new children that are added
      if(currentUserUid !== snap.key) { //on snap call back, makes sure user snpa back !== user key(which is current authorized usr)
        let user = snap.val();
        user['uid'] = snap.key; //user variable = value of snap
        user['status'] = 'offline'; //sets initial user status to offline
        loadedUsers.push(user); //take each user object, push it to loaded users array
        this.setState({ users: loadedUsers }) //puts in within local state on to users property
      }
    });

    this.state.connectedRef.on('value', snap => { //listends for change in vlaue (ie: add new freinds, or delete old friends)
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => { //if our user disconnects from the app we will render the remove method
          if (err !== null) {
            console.error(err)
          }
        })
      }
    })

    this.state.presenceRef.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });
    this.state.presenceRef.on('child_removed', snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false) //indicates user is not connected and gives them a status of offline
      }
    });
  }

  addStatusToUser = (userId, connected = true) => { //shows if users are online or not
    const updatedUsers = this.state.users.reduce((acc, user) => { //iterat each user
      if (user.uid === userId) { 
        user['status'] = `${connected ? 'online' : 'offline'}`; //checks if 'connected' reference is true. If so, shows 'online'. otherwise 'offline'
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers })
  }

  isUserOnline = user => user.status === 'online';

  changeChannel = user => {
    const channelId = this.getChannelId(user.id)
    const channelData = {
      id: channelId,
      name: user.name,
    }
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
  }

  getChannelId = userId => { // allows us to make unique messenger channel for every direct message
    const currentUserId = this.state.user.uid;
    return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}` //check to see if user Id clicked on length is less than authorized user
  }

  render() {
    const { users } = this.state
    return(
      <Menu.Menu>
        <Menu.Item>
          <span>
            <Icon name="mail" /> Direct Messages
          </span>{' '}
          ({ users.length })
        </Menu.Item>
        {/* Users to Send Direct Messages */}
        {users.map(user => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    )
  }
}

export default connect(null,{setCurrentChannel, setPrivateChannel })(DirectMessages);
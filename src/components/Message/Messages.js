import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import { connect } from 'react-redux';
import { setUserPosts } from '../../actions';
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import Typing from './Typing';

class Messages extends React.Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref('privateMessages'),
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    isChannelStarred: false,
    user: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
    numUniqueUsers: "",
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    typingRef: firebase.database().ref('typing'),
    typingUsers: [],
    connectedRef: firebase.database().ref('.info/connected'),
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
      this.addUserStarsListener(channel.id, user.uid);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
    this.addTypingListeners(channelId)
  };

  addTypingListeners = channelId => {
    let typingUsers = []; //empty array to collect all users typing within a given channel
    this.state.typingRef.child(channelId).on('child_added', snap => { //pass in channelId and listen for the 'child_Added' event
      if (snap.key !== this.state.user.uid) { //within the snap, we will first see if snap.key is not equal to user.uid so we are not collecting current user to typing array
        typingUsers = typingUsers.concat({ // using .concat method to concat an obbject at end of array with id set to snap.key (to collect users ID) and name property to snap.value
          id: snap.key,
          name: snap.val()
        })
        this.setState({ typingUsers })
      }
    })

    this.state.typingRef.child(channelId).on('child_removed', snap => { //using the snap callback...
      const index = typingUsers.findIndex(user => user.id === snap.key); //we are gonna toake tthe typing users array, use the findindex method to iterate all user elements and compare user.id to sanp.key
      if (index !== -1) { //if there is no index value that is positive...
        typingUsers = typingUsers.filter(user => user.id !== snap.key); //we will iterate over typing users array making sure none of the userId === snap.key
        this.setState({ typingUsers })
      }
    })

    this.state.connectedRef.on('value', snap => { //take connected ref from state and listen for value change
      if (snap.val() === true) { //within the snap callback, make sure value is equal to true...
        this.state.typingRef //then take the typing ref...
          .child(channelId) //take the child on it of 'childId...
          .child(this.state.user.uid) //child of current users, user ID...
          .onDisconnect() //when our authorized user logs out...
          .remove(err => { //their value on the typing ref will be removed
            if  (err !== null) {
              console.log(err)
            }
          })
      }
    })
  }

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages)
    });
  };

  addUserStarsListener = (channelId, userId) => { //get all channels and relate them to what user has starred
    this.state.usersRef
      .child(userId) //select child based off user id
      .child('starred') //get all starred props
      .once('value') //get value
      .then(data => {
        if (data.val() !== null) { //make sure starred prop isn't null
          const channelIds = Object.keys(data.val()); //gets id of all channels saved
          const prevStarred = channelIds.includes(channelId); //sees if the current id is present
          this.setState({ isChannelStarred: prevStarred }) //
        }
      })

  }

  getMessagesRef = () => { //helper function to identify if it is a private message aka DM or regular public channel
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  handleStar = () => { //makes star boolean when clicked (on/off favorite/not-favorite)
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred,
    }), () => this.starChannel())
  }

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`) //select child of references based on user id
        .update({ //dynamically change id of channeland its realted data
          [this.state.channel.id]: {
            name: this.state.channel.name,
            details: this.state.channel.details,
            createdBy: {
              name: this.state.channel.createdBy.name,
              avatar: this.state.channel.createdBy.avatar
            }
          }
        })
    } else { //else, take the same child id and apply the remove method
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove(err => {
          if (err !== null) {
            console.errors(err)
          }
        })
    }
  }

  handleSearchChange = event => {
    this.setState({
      searchTerm: event.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages());
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages]; //copy the messages array and assign it for channel messages so we dont mutate original array
    const regex = new RegExp(this.state.searchTerm, "gi"); //indicates regex to apply globbally (g) and case insensitive (i) is applied
    const searchResults = channelMessages.reduce((acc, message) => { //apply .reduce to search through entire messages array, setting acc to empty array, setting iterator as 'message'
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) { //if message.content matches our regex, 
        acc.push(message); //we will push thee acc onto array
      }
      return acc;
    }, []);
    this.setState({ searchResults}); //returns acc onto state.
    setTimeout(() => this.setState({ searchLoading: false }), 1000); //disables search button while results load for 1000 miliseconds
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ numUniqueUsers });
  };

  //REVIEW SECTION 13, LECTURE 49 @ BEGINNING THOROUGH REVIEWS
  countUserPosts = messages => { //takes accumulator of messages for each channel
    let userPosts = messages.reduce((acc, message) => { //userPosts will return the value of the function
      if (message.user.name in acc) { //check if iterator 
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  }

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = channel => {
    return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '';
  }

  displayTypingUsers = users => (
    users.length > 0 && users.map(user => (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.2em' }} key={user.id}>
        <span className="user__typing">{user.name} is typing</span>
      </div>
    ))
  )

  render() {
    const { messagesRef, messages, channel, user, numUniqueUsers, searchTerm, searchResults, searchLoading, privateChannel, isChannelStarred, typingUsers } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? this.displayMessages(searchResults) :
            this.displayMessages(messages)}
           {this.displayTypingUsers}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);


// import React, { Component } from 'react';
// import { Segment, Comment} from 'semantic-ui-react';
// import MessagesHeader from './MessagesHeader';
// import MessageForm from './MessageForm';
// import firebase from '../../firebase';
// import Message from './Message.js'

// class Messages extends Component {
//   state = {
//     messagesRef: firebase.database().ref('messages'), //referencing 'messages' to communicate reference (used in message form) to our back-end
//     messages: [],
//     messagesLoading: true,
//     channel: this.props.currentChannel,
//     user: this.props.currentUser,
//     numUniqueUsers: ''
//   }

//   componentDidMount() {
//     const { channel, user } = this.state;

//     if (channel && user) {
//       this.addListeners(channel.id)
//     }
//   }

//   addListeners = channelId => {
//     this.addMessageListener(channelId);
//   }

//   //SECTION 8 LESSON 30 GOES INTO DEPT ON .SNAP FUNCTION AND GETTING MESSAGES TO RENDER INTO CONSOLE ON THE DOM
//   addMessageListener = channelId => { //listening for any new messages in any given channel
//     let loadedMessages = []; //an array of unopened messages
//     this.state.messagesRef.child(channelId).on("child_added", snap => {
//       loadedMessages.push(snap.val());
//       //console.log(loadedMessages, 'ITS HERE')
//       this.setState({
//         messages: loadedMessages,
//         messagesLoading: false
//       });
//       this.countUniqueUsers(loadedMessages);
//     })
//   }

//   countUniqueUsers = messages => { //takes messages array. uses reduce method
//     const uniqueUsers = messages.reduce((acc, message) => {
//       if (!acc.includes(message.user.name)) { //see if acc array has message.user.name
//         acc.push(message.user.name);
//       }
//       return acc;
//     }, []); //return acc array at the end
//     const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
//     const numUniqueUsers = `${uniqueUsers.length} users${plural ? "s" : ""}`;
//     this.setState({ numUniqueUsers });
//   }
//   displayMessages = messages =>
//     messages.length > 0 && messages.map(message => (
//       <Message
//         key={message.timestamp}
//         message={message}
//         user={this.state.user}
//       />
//     ));


//   displayChannelName = channel => channel ? `#${channel.name}` : '';

//   render() {
//     const { messagesRef, messages, channel, user, numUniqueUsers } = this.state;
//     return (
//       <React.Fragment>
//         <MessagesHeader 
//           channelName={this.displayChannelName(channel)}
//           numUniqueUsers={numUniqueUsers}
//         />

//         <Segment>
//           <Comment.Group className="messages">
//             {this.displayMessages(messages)}
//           </Comment.Group>
//         </Segment>

//         <MessageForm
//           messagesRef={messagesRef}
//           currentChannel={channel}
//           currentUser={user}
//         />
//       </React.Fragment>
//     )
//   }
// }

// export default Messages;
import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    numUniqueUsers: "",
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  handleSearchChange = event => {
    this.setState({
      searchTerm: event.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages());
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages]; //copy the messages array and assign it for channel messages so we dont mutate original array
    const regex = new RegExp(this.state.searchTerm, "\gi"); //indicates regex to apply globbally (g) and case insensitive (i) is applied
    const searchResults = channelMessages.reduce((acc, message) => { //apply .reduce to search through entire messages array, setting acc to empty array, setting iterator as 'message'
      if (message.content && message.content.match(regex) || message.user.name.match(regex)) { //if message.content matches our regex, 
        acc.push(message); //we will push thee acc onto array
      }
      return acc;
    }, []);
    this.setState({ searchResults}); //returns acc onto state.
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

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = channel => (channel ? `#${channel.name}` : "");

  render() {
    const { messagesRef, messages, channel, user, numUniqueUsers, searchTerm, searchResults } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
        />

        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? this.displayMessages(searchResults) :
            this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
        />
      </React.Fragment>
    );
  }
}

export default Messages;


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
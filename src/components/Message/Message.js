import React from 'react';
import moment from 'moment';
import { Comment, Image } from 'semantic-ui-react';

const isOwnMessage = (message, user ) => { //checks to see if the creater of the message matches to the property 'image' and doesn't have the property of 'content',  and if so, changes the class for visual sake. making income and outgoing messages diffferent colors in a conversation
  return message.user.id === user.uid ? 'message__self' : '';
}

const isImage = (message) => {
  return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => (
  <Comment>
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user)}>
      <Comment.Author as="a">{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
      {isImage(message) ?
        <Image src={message.image} className="message__images" /> :
        <Comment.Text>{message.content}</Comment.Text>
      }
    </Comment.Content>
  </Comment>

)


export default Message;
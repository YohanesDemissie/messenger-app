import React from "react";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List
} from "semantic-ui-react";

class MetaPanel extends React.Component {
  state = {
    channel: this.props.currentChannel,
    privateChannel: this.props.isPrivateChannel,
    activeIndex: 0
  };

  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  formatCount = num => (num > 1 || num === 0 ? `${num} posts` : `${num} post`);

  displayTopPosters = posts =>
    Object.entries(posts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{this.formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  render() {
    const { activeIndex, privateChannel, channel } = this.state;
    const { userPosts } = this.props;

    if (privateChannel) return null;

    return (
      <Segment loading={!channel}>
        <Header as="h3" attached="top">
          About # {channel && channel.name}
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {channel && channel.details}
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List>{userPosts && this.displayTopPosters(userPosts)}</List>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as="h3">
              <Image circular src={channel && channel.createdBy.avatar} />
              {channel && channel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPanel;


// import React, { Component } from 'react';
// import { Segment, Accordion, Header, Icon, Image, List } from 'semantic-ui-react';

// class MetaPanel extends Component {
//   state = {
//     channel: this.props.currentChannel,
//     privateChannel: this.props.isPrivateChanel,
//     activeIndex: 0,
//   }

//   setActiveIndex = (event, titleProps) => { //
//     const { index } = titleProps; //onclick, we will grabb index of title prop
//     const { activeIndex } = this.state; //grabbing active index from state
//     const newIndex = activeIndex === index ? -1 : index; //update active index to new index
//     this.setState({ activeIndex: newIndex }); //if active index = index of our titleProps, we give it the value of -1, otherwise set to new index
//   };

//   formatCount = num => (num > 1 || num === 0 ? `${num} posts` : `${num} post`);//if num = 1 or 0, render "post" ortherwise ""

//   displayTopPosters = posts =>
//     Object.entries(posts) //object.entries() takes in an object, and places each key/value pair into its own separate array within a larger array. In this case we are passing in all objects witihn posts
//       .sort((a, b) => b[1] - a[1]) //allows us to see in a descending order greatest counted posts to leatest counted posts
//       .map(([key, val], i) => ( //using map method  desturcutres each key and value of the array and use them to reference for display of our top posters in our markup later on
//         <List.Item key={i}> {/* i will be the current index reference while iterating through key, value arrays */}
//           <Image avatar src={val.avatar} />
//           <List.Content>
//             <List.Header as="a">{key}</List.Header>
//             <List.Description>{this.formatCount(val.count)}</List.Description>
//           </List.Content>
//         </List.Item>
//       ))
//       .slice(0, 5); //displays up to 5 top posters at a time


//   render() {
//     const { activeIndex, privateChannel, channel } = this.state;
//     const { userPosts } = this.props;

//     if (privateChannel) return null;

//     return (
//       <Segment loading={!channel}>
//         <Header as="h3" attached="top">
//           About # {channel && channel.name}
//         </Header>
//         <Accordion styled attached="true">
//           <Accordion.Title
//             active={activeIndex === 0}
//             index={0}
//             onClick={this.setActiveIndex}
//           >
//           <Icon name="dropdown" />
//           <Icon name ="info" />
//           Channel Details
//           </Accordion.Title>
//           <Accordion.Content active={activeIndex === 0}>
//             {channel && channel.details}
//         </Accordion.Content>

//           <Accordion.Title
//             active={activeIndex === 1}
//             index={1}
//             onClick={this.setActiveIndex}
//           >
//             <Icon name="dropdown" />
//             <Icon name="user circle" />
//             Top Posters
//           </Accordion.Title>
//           <Accordion.Content active={activeIndex === 1}>
//             <List>
//               {userPosts && this.displayTopPosters(userPosts)}
//             </List>
//         </Accordion.Content>

//           <Accordion.Title
//             active={activeIndex === 2}
//             index={2}
//             onClick={this.setActiveIndex}
//           >
//             <Icon name="dropdown" />
//             <Icon name="pencil alternate" />
//             Created By
//           </Accordion.Title>
//           <Accordion.Content active={activeIndex === 2}>
//             <Header as="h3">
//               <Image circular src={channel && channel.createdBy.avatar} />
//               {channel && channel.createdBy.name}
//             </Header>
//         </Accordion.Content>
//         </Accordion>
//       </Segment>
//     )
//   }
// }

// export default MetaPanel;
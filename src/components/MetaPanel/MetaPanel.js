import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon } from 'semantic-ui-react';

class MetaPanel extends Component {
  state = {
    privateChannel: this.props.isPrivateChanel,
    activeIndex: 0,
  }

  setActiveIndex = (event, titleProps) => { //
    const { index } = titleProps; //onclick, we will grabb index of title prop
    const { activeIndex } = this.state; //grabbing active index from state
    const newIndex = activeIndex === index ? -1 : index; //update active index to new index
    this.setState({ activeIndex: newIndex }); //if active index = index of our titleProps, we give it the value of -1, otherwise set to new index
  }

  render() {
    const { activeIndex, privateChannel } = this.state;

    if (privateChannel) return null;

    return (
      <Segment>
        <Header as="h3" attached="top">
          About # Channel
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
          <Icon name="dropdown" />
          <Icon name ="info" />
          Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            details
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
            posters
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
            creator
        </Accordion.Content>
        </Accordion>
      </Segment>
    )
  }
}

export default MetaPanel;
import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import './styles/App.css';

import ColorPanel from './components/ColorPanel/ColorPanel';
import SidePanel from './components/SidePanel/SidePanel';
import Messages from './components/Message/Messages';
import MetaPanel from './components/MetaPanel/MetaPanel';




const App = ({ currentUser, currentChannel, isPrivateChannel }) => (
      <Grid columns='equal' className='app' style={{ background: '#eee'}}>
        <ColorPanel />
        <SidePanel
          key={currentUser && currentUser.uid}
          currentUser={currentUser}
        />
        <Grid.Column style={{marginLeft: 320}}>
          <Messages
            key={currentChannel && currentChannel.id}
            currentChannel={currentChannel}
            currentUser={currentUser}
            isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <MetaPanel
            key={currentChannel && currentChannel.id}
            isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>
      </Grid>
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
});

export default connect(mapStateToProps)(App);

// import React, { Component, Fragment } from 'react';
// import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
// import firebase from './firebase';

// import Home from './components/Home';
// import Login from './components/Auth/Login.js';
// import Register from './components/Auth/Register.js';
// import "semantic-ui-css/semantic.min.css"; //lets change this later to raw styling
// import './styles/App.css';


// class App extends Component {
//   componentDidMount() {
//     firebase.auth().onAuthStateChanged( user => {
//       if (user) {
//         this.props.history.push('/'); //redirects user to homeroute if firebause detects authorized user (aka when user logs in)
//       }
//     })
//   }
//   render() {
//     return (
//       <Router>
//         <Fragment>
//           <Route exact path='/' component={Home}/>
//           <Route exact path='/Login' component={Login} />
//           <Route exact path='/Register' component={Register} />
//         </Fragment>
//       </Router>
//     );
//   }
// }

// // const RootWithAuth = withRouter(App)

// export default App;

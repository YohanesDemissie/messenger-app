import React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
// import './styles/App.css';
import ColorPanel from './components/ColorPanel/ColorPanel';
import SidePanel from './components/SidePanel/SidePanel';
import Message from './components/Message/Message';
import MetaPanel from './components/MetaPanel/MetaPanel';




const App = () => (
      <Grid columns='equal' className='app' style={{ background: '#eee'}}>
        <ColorPanel />
        <SidePanel />
        <Grid.Column style={{marginLeft: 320}}>
          <Message />
        </Grid.Column>
        <Grid.Column width={4}>
          <MetaPanel />
        </Grid.Column>
      </Grid>
)


export default App;

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

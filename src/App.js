import React, { Component } from 'react'

class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
      </div>
    )
  }
}

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

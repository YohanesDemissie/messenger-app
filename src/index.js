import ReactDOM from 'react-dom';

import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import firebase from './firebase';

import Home from './components/Home';
import Login from './components/Auth/Login.js';
import Register from './components/Auth/Register.js';
import "semantic-ui-css/semantic.min.css"; //lets change this later to raw styling
import './styles/App.css';


class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push('/'); //redirects user to homeroute if firebause detects authorized user (aka when user logs in)
      }
    })
  }
  render() {
    return (
        <Fragment>
          <Route exact path='/' component={Home} />
          <Route exact path='/Login' component={Login} />
          <Route exact path='/Register' component={Register} />
        </Fragment>
    );
  }
}

const RootWithAuth = withRouter(Root)

ReactDOM.render(<Router><RootWithAuth /></Router>, document.getElementById('root'));

// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

import ReactDOM from 'react-dom';

import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom'; //withRouter is used down below to allow logged in users to go straight to home page
import firebase from './firebase';

import Home from './components/Home';
import Login from './components/Auth/Login.js';
import Register from './components/Auth/Register.js';
import "semantic-ui-css/semantic.min.css"; //lets change this later to raw styling
import './styles/App.css';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser } from './actions';

const store = createStore(rootReducer, composeWithDevTools()); //holds user_reducer properties in actions 


class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        //console.log(user);
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

const RootWithAuth = withRouter(connect(null, { setUser })(Root)) //this allows logged in users to go straight to home page on app load

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>, document.getElementById('root'));

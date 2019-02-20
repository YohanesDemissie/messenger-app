import ReactDOM from 'react-dom';

import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom'; //withRouter is used down below to allow logged in users to go straight to home page
import firebase from './firebase';

import App from './App';
import Login from './components/Auth/Login.js';
import Register from './components/Auth/Register.js';
import "semantic-ui-css/semantic.min.css"; //lets change this later to raw styling
import './styles/App.css';

import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser, clearUser } from './actions';
import Spinner from './components/Spinner'

const store = createStore(rootReducer, composeWithDevTools()); //holds user_reducer properties in actions 


class Root extends Component {
  componentDidMount() {
    console.log(this.props.isLoading); //prints true or false depending on the user being logged in or not
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        //console.log(user);
        this.props.history.push('/'); //redirects user to homeroute if firebause detects authorized user (aka when user logs in)
      } else {
        this.props.history.push('./login');
        this.props.clearUser();
      }
    })
  }
  render() {
    return this.props.isLoading ? <Spinner /> :(
      <Fragment>
          <Route exact path='/' component={App} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
        </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
})


const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root)) //this allows logged in users to go straight to home page on app load/logout user and go straight to login page when not signed in

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>, document.getElementById('root'));

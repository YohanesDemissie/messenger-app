import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Auth/Login.js';
import Register from './components/Auth/Register.js';
import "semantic-ui-css/semantic.min.css"; //lets change this later to raw styling
import './styles/App.css';


class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Route exact path='/' component={Home}/>
          <Route exact path='/Login' component={Login} />
          <Route exact path='/Register' component={Register} />
        </Fragment>
      </Router>
    );
  }
}

export default App;

import React from "react";
import firebase from "../../firebase";
import md5 from 'md5'; //used to hash messages. We'll be using it to provide a unique ID for a unique avatar per user
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true}) //so the user can only register one email at a time
      firebase //the following includes many tools from the firebase library. Review documentation for future reference.
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user.updateProfile({
            displayName: this.state.username,
            photoURL: `http://gravatar.com/avatar${md5(createdUser.user.email)}?d=identicon` //look into md5 and firebase documentation for any clarity or future reference
          })
          .then(() => {
            this.saveUser(createdUser).then(() => {
              console.log('user saved');
            })
          })
          .catch(err => {
            console.error(err)
            this.setState({ errors: this.state.errors.concat(err), loading: false});
          })
        })
        .catch(err => {
          console.error(err);
          this.setState({ errors: this.state.errors.concat(err), loading: false });
        });
    }
  };

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    })
  }

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
                className={this.handleInputError(errors, 'username')} //quotes 'username' works as input name for handleInputError helper function
                type="text"
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, 'email')} //quotes 'email' works as input name for handleInputError helper function
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError(errors, 'password')} //quotes 'password' works as input name for handleInputError helper function
                type="password"
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'passwordConfirmation')} //quotes 'passwordConfirmation' works as input name for handleInputError helper function
                type="password"
              />

              <Button disabled={loading} className={ loading ? 'loading' : ''} color="orange" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;


// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react'

// import firebase from '../../firebase';

// class Register extends Component {
//   state = {
//     username: '',
//     email: '',
//     password: '',
//     passwordConfirmation: '',
//     errors: []
//   };

//   isFormValid = () => {
//     let errors = [];
//       let error;

//     if (this.isFormEmpty(this.state)) {
//       error = { message: 'fill in all fields'};
//       this.setState({ errors: errors.concat(errors) }) //concatenates empty error array to error object
//         return false;
//     } else if (!this.isPasswordValid(this.state)) {
//       error = { message: 'Password is invalid' };
//       this.setState({ errors: errors.concat(error) });
//       return false;
//       //throw error if input isnt valid
//     } else {
//       return true;
//     }
//   }

//   isFormEmpty = ({ username, email, password, passwordConfirmation }) => { //makes sure none of the inputs are empty
//     return ( !username.length || !email.length || !password.length || !passwordConfirmation.length );
//   };

//   isPasswordValid = ({ password, passwordConfirmation }) => {
//     if ( password.length < 6 || passwordConfirmation.length < 6 ) {
//       return false;
//     } else if ( password !== passwordConfirmation ) {
//       return false;
//     } else {
//       return true;
//     }
//   }

//   displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

//   handleChange = event => {
//     this.setState({ [event.target.name]: event.target.value }); //event.target.name is listening in the name form, and in return we get the value
//   }

//     handleSubmit = event => {
//       if(this.isFormValid()) {
//       event.preventDefault(); //prevents the default action to reload the page
//         firebase
//           .auth()
//           .createUserWithEmailAndPassword(this.state.email, this.state.password) //look into fire base docs for further understanding of firebase library
//             .then(createdUser => {
//               console.log(createdUser, 'this is not part of the firebase library but my own naming convention')
//             })
//             .catch(err => {
//               console.error(err)
//             });
//     }
//   };

//   render() {
//     const { username, email, password, passwordConfirmation, errors } = this.state //deconstructs properties to not have to repeat, "this.props" for each proptery
//     return (
//       <Grid textAlign="center" verticalAlign="middle" className='app'>
//         <Grid.Column style={{ width: 450 }}>
//           <Header as="h2" icon color="orange">
//             <Icon name="puzzle piece" color="orange" />
//             Register For Messenger App
//           </Header>
//           <Form onSubmit={this.handleSubmit} size="large">
//             <Segment stacked>
//             <Form.Input fluid name="username" icon="user" iconPosition="left"
//               placeholder="username" onChange={this.handleChange} value={username} type="text"/>

//             <Form.Input fluid name="email" icon="mail" iconPosition="left"
//                 placeholder="Email Address" onChange={this.handleChange} value={email} type="email" />

//             <Form.Input fluid name="password" icon="lock" iconPosition="left"
//                 placeholder="Password" onChange={this.handleChange} value={password} type="password" />

//             <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left"
//                 placeholder="Password Confirmation" onChange={this.handleChange} value={passwordConfirmation} type="password" />

//             <Button color="orange" fluid size="large">Submit</Button>
//             </Segment>
//           </Form>
//           {errors.length > 0 && (
//             <Message error>
//               <h3>Error</h3>
//               {this.displayErrors(errors)}
//             </Message>
//           )}
//           <Message>
//             Already a user? <Link to='/login'> Login</Link>
//           </Message>
//         </Grid.Column>
//       </Grid>
//     )
//   }
// }

// export default Register;
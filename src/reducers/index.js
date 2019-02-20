import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

const initialUserSate = { //initial user state with be 'loggedin=false' in this switch case to switch between being logged in and having to log in. 'isLoading' being the keh value pair representing "is user loged in"
  currentUser: null,
  isLoading: true
}

const user_reducer = (state = initialUserSate, action) => {
  switch(action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      }
      default:
        return state;
  }
}

const rootReducer = combineReducers ({ //user_reducer will be updating and putting its state value on this user property
  user: user_reducer
})

export default rootReducer;

// section 5, Lecture 13 is what we shall review later to get a deeper understanding of the log in action and reducer porporties and methods used here after final deployment

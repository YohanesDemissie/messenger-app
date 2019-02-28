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
      case actionTypes.CLEAR_USER:
        return {
          ...state,
          isLoading: false
        }
      default:
        return state;
  }
}

const initialChannelState = {
  currentChannel: null,
  isPrivateChannel: false
}

const channel_reducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      };
      case actionTypes.SET_PRIVATE_CHANNEL:
        return {
          ...state,
          isPrivateChannel: action.payload.isPrivateChannel
        }
    default:
      return state;
  }
}

const rootReducer = combineReducers ({ //user_reducer will be updating and putting its state value on this user property
  user: user_reducer,
  channel: channel_reducer
});

export default rootReducer;

// section 5, Lecture 13 is what we shall review later to get a deeper understanding of the log in action and reducer porporties and methods used here after final deployment

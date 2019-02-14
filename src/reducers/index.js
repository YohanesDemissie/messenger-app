import * as actionTypes from '../actions/index';

const user_reducer = (state, action) => {
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

//stopped at section 5 Lecture 14 at 5 mins and 27 seconds
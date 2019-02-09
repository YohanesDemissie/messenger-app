import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyBCOPo6n0OkmE-jA3xWtzq-jq4baW2FBA8",
  authDomain: "messenger-auth.firebaseapp.com",
  databaseURL: "https://messenger-auth.firebaseio.com",
  projectId: "messenger-auth",
  storageBucket: "messenger-auth.appspot.com",
  messagingSenderId: "180420585231"
};
firebase.initializeApp(config);


export default firebase;
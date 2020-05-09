import firebase from 'firebase';
require('firebase/firestore');

const config = {
  apiKey: "AIzaSyB_dMTTkJjvVWJE6tcl01z46VsOE8goD4Q",
  authDomain: "trackpet-a345e.firebaseapp.com",
  databaseURL: "https://trackpet-a345e.firebaseio.com",
  projectId: "trackpet-a345e",
  storageBucket: "trackpet-a345e.appspot.com",
  messagingSenderId: "528368833324"
};

firebase.initializeApp(config)

const db = firebase.firestore()

export default db;
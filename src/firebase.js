// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAhCSBYsF95Mkd0sxUa6haRiXnfXHn8UUY",
    authDomain: "myclothershops.firebaseapp.com",
    databaseURL: "https://myclothershops-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "myclothershops",
    storageBucket: "myclothershops.appspot.com",
    messagingSenderId: "665434250501",
    appId: "1:665434250501:web:0429caea8fa2d4255ceb6c",
    measurementId: "G-1GVT5CRH6M"
  };
  firebase.initializeApp(firebaseConfig);

  export const firebaseAuth = firebase.auth();

  export const firestore = firebase.firestore();  

  export default firebase
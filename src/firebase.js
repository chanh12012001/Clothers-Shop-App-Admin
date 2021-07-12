// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXLa9wDIJ2bJk1JDIGYzxIyV6e1SxpTJk",
  authDomain: "my-clothers-shop-app.firebaseapp.com",
  databaseURL: "https://my-clothers-shop-app.firebaseio.com",
  projectId: "my-clothers-shop-app",
  storageBucket: "my-clothers-shop-app.appspot.com",
  messagingSenderId: "1048729347049",
  appId: "1:1048729347049:web:adb438a992f38f2cd56178",
  measurementId: "G-8N21E95RCX",
};

firebase.initializeApp(firebaseConfig);

export const firebaseAuth = firebase.auth();

export const firestore = firebase.firestore();

export const storageRef = firebase.storage().ref();

export default firebase;

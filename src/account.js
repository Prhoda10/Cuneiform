import { initializeApp } from 'firebase/app';

const app = initializeApp({
  apiKey: "AIzaSyBdfLZLTXIK3dFvMUR7R0vOWwC01iceGAo",
  authDomain: "cuneiform-99812.firebaseapp.com",
  databaseURL: "https://cuneiform-99812-default-rtdb.firebaseio.com",
  projectId: "cuneiform-99812",
  storageBucket: "cuneiform-99812.appspot.com",
  messagingSenderId: "294328255555",
  appId: "1:294328255555:web:a47d8083d73fe98aafc0f6",
  measurementId: "G-9PGSSD2423"
});

import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();

// Build Firebase credential with the Google ID token.
const credential = GoogleAuthProvider.credential(id_token);

// Sign in with credential from the Google user.
const auth = getAuth();
signInWithCredential(auth, credential).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
});

function googleSignin() {
   getAuth()
   
   .signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
		
      console.log(token)
      console.log(user)
   }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
		
      console.log(error.code)
      console.log(error.message)
   });
}

function googleSignout() {
    getAuth()
	
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}


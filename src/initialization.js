//initialize app
var firebase = require('firebase/app');

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdfLZLTXIK3dFvMUR7R0vOWwC01iceGAo",
  authDomain: "cuneiform-99812.firebaseapp.com",
  databaseURL: "https://cuneiform-99812-default-rtdb.firebaseio.com",
  projectId: "cuneiform-99812",
  storageBucket: "cuneiform-99812.appspot.com",
  messagingSenderId: "294328255555",
  appId: "1:294328255555:web:a47d8083d73fe98aafc0f6",
  measurementId: "G-9PGSSD2423"
};
/*
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/*
// Trying to do something with the service account 
initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://cuneiform-99812-default-rtdb.firebaseio.com/'
});
var serviceAccount = require("/Users/kes/Downloads/service-account-file.json");
*/

var getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup = require('firebase/auth'); 
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  'login_hint': 'user@example.com'
});

signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

/*
// Build Firebase credential with the Google ID token.
const credential = GoogleAuthProvider.credential(id_token);

// Sign in with credential from the Google user.
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

*/




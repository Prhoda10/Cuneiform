/* This file initializes our app - 
* allows firebase to work
*/
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

import { getDatabase, ref as sRef, set } from 'firebase/database';

//testing a function to use the realtime database
function writeUserData(userId, name, email) {
  const db = getDatabase();
  set(sRef(db, 'users/' + userId), {
    username: name,
    email: email,
  });
}
writeUserData("98883", "hello", "gloria.kim@my.wheaton.edu")
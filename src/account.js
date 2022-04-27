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
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, addDoc, collection, serverTimestamp, getDoc, query, where, onSnapshot } from "firebase/firestore";

//parameters for signInWithPopup
var provider = new GoogleAuthProvider();
var auth = getAuth();

onAuthStateChanged(auth, (user) => {
   var x = document.getElementById("signOutBtn");
   var y = document.getElementById("signInBtn");
   if (user) {
      isLoggedIn();
      //logged in stuff
      y.style.display = "none";
      x.style.display = "block";
   } else {
      //not logged in
      y.style.display = "block";
      x.style.display = "none";
   }
});

if (document.getElementById("signInBtn")) {
   document.getElementById("signInBtn").addEventListener("click", () => {
      if(isLoggedIn()) {
         isLoggendIn();
         window.alert("You are already signed in.");
      } else {
      login();
      }
   });
}
if (document.getElementById("signOutBtn")) {
   document.getElementById("signOutBtn").addEventListener("click", () => {
      if (auth) {
         console.log("Signing out...");
         signOut(auth);
      }
   });
   document.getElementById("signOutBtn").style.display = "block";
}

export function login() {
   signInWithPopup(auth, provider)
   .then((result) => {
      console.log("sign in initiated");
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      const name = user.displayName;
      const email = user.email;
      console.log(name + email);
      addUser(name, email);

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
}

export async function addUser(name, email) {
   try {
      const q = query(
         collection(getFirestore(), "user"),
         where("email", "==", email)
      );
      const snap = onSnapshot(q, (querySnapshot) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log(`Successfully fetched user data: ${querySnapshot.size}`);
            return;
      }, err => {
            const docRef = addDoc(collection(getFirestore(), 'user'), {
               name: name,
               email: email,
               timestamp: serverTimestamp()
            });
            console.log("User Added: ", docRef.id);
         });
   }
   catch (error) {
      console.error('Error writing new user to Firestore', error);
   }
}

export function isLoggedIn() {
   const user = auth.currentUser;
   if (user) {
      console.log("The current user is: " + user.displayName + " " + user.email + " " + user.uid);
      return true;
   } else {
      console.log("user is null/user doesn't exist");
      return false;
   }
}

export function getUserEmail() {
   return auth.currentUser.email;
}

export function getUID() {
   return auth.currentUser.uid;
}
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore, addDoc, collection, serverTimestamp, getDoc, query, where, onSnapshot } from "firebase/firestore";

//parameters for signInWithPopup
var provider;
var auth;

document.addEventListener('DOMContentLoaded', () => {
   provider = new GoogleAuthProvider();
   auth = getAuth();
});

if (document.getElementById("signInBtn")) {
   document.getElementById("signInBtn").addEventListener("click", () => {
      login();
   });
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

// var fb = getFirestore.database.ref();

// /**
//  * @param {string} emailAddress
//  * @return {Object} the object contains zero or more user records, the keys are the users' ids
//  */
// function findUsersMatchingEmail( emailAddress, callback ) {
//     fb.child('user').orderByChild('emailAddress').equalTo(emailAddress).once('value', function(snap) {
//         callback( snap.val() );
//     });
// }

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
   if (auth.currentUser) {
      return true;
   } else {
      return false;
   }
}

export function getUserEmail() {
   return auth.currentUser.email;
}
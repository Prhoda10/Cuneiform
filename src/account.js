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

      .signInWithPopup(provider).then(function (result) {
         var token = result.credential.accessToken;
         var user = result.user;

         console.log(token)
         console.log(user)
      }).catch(function (error) {
         var errorCode = error.code;
         var errorMessage = error.message;

         console.log(error.code)
         console.log(error.message)
      });
}

function googleSignout() {
   getAuth()

      .then(function () {
         console.log('Signout Succesfull')
      }, function (error) {
         console.log('Signout Failed')
      });
}


//Note Database methods  
import { getDatabase, ref as dbref, set, onValue, serverTimestamp } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUID } from '../src/account.js';
import { app } from './initialization.js';
import { generateID } from './prayerjar.js';

var auth = getAuth();
var isLoggedIn;

onAuthStateChanged(auth, (user) => {
   if (user) {
      isLoggedIn = true;
   } else {
      isLoggedIn = false;
   }
});

export function addNote(note, ref) {
  $('#noteChart').empty();
  const db = getDatabase();
  let noteID = generateID(10);
  set(dbref(db, 'users/' + auth.currentUser.uid +'/notes/'+ref+'/'+noteID), {
    reference: ref,
    text: note,
    timestamp: serverTimestamp()
  });
  location.reload();
}

// export async function addNote(note, ref) {
//   try {
//     const docRef = await addDoc(collection(getFirestore(), 'users/'+getUserEmail().toString()+'/notes'), {
//       reference: ref,
//       text: note,
//       timestamp: serverTimestamp()
//     });
//     console.log("Note Submitted: ", docRef.id);
//   }
//   catch (error) {
//     console.error('Error writing new note to Firebase Firestore Database', error);
//   }
// }

export function indicateNotes(ref) {
  $("#noteChart").empty();
  const db = getDatabase();
  const noteRef = dbref(db, 'users/'+auth.currentUser.uid+'/notes/'+ref+"/");
  onValue(noteRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      let div = document.createElement("div");
      div.innerHTML = "\"" + childSnapshot.val().text + "\"";
      document.getElementById("noteChart").appendChild(div);
      console.log("div");
      var timeStamp = childSnapshot.val().timestamp;
      var date = new Date(timeStamp);
      document.getElementById("noteChart").innerHTML += "<div>" + date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear() + "</div>" + "<br><br>";
    });
  });
}
//Note Database methods  
import { getDatabase, ref as dbref, set, onValue, serverTimestamp } from 'firebase/database';
import { getUID } from '../src/account.js';

export function addNote(note, ref) {
  const db = getDatabase();
  set(dbref(db, 'users/' + getUID() +'/notes'), {
    reference: ref,
    text: note,
    timestamp: serverTimestamp()
  });
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

function indicateNotes(ref) {
  const db = getDatabase();
  const noteRef = dbref(db, 'users/'+auth.currentUser.uid+'/notes');
  onValue(noteRef, (snapshot) => {
    if (snapshot.val().reference == ref) {
      document.getElementById("noteChart").innerHTML += "<div>" + "reference: " + snapshot.val().reference + "</div>";
      document.getElementById("noteChart").innerHTML += "<div>" + "text: " + snapshot.val().text + "</div>";
      document.getElementById("noteChart").innerHTML += "<div>" + "date: " + snapshot.val().timestamp + "</div>" + "<br><br>";
    }
  });
}
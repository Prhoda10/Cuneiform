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
import { bookMap, versMap } from '../src/initialization.js'
//fetch API
var esvapi_url = 'https://api.esv.org/v3/passage/html/?q=';

import { ESVoptions, apiBibOptions } from '../src/myAPIKey.js';

let next = [];
let prev = [];
export var canon = "";

import { getAuth, onAuthStateChanged } from 'firebase/auth';

//Auth
var auth = getAuth();
var isLoggedIn;

onAuthStateChanged(auth, (user) => {
   if (user) {
      isLoggedIn = true;
   } else {
      isLoggedIn = false;
   }
});

//Check if its a search or a reference and delegate
export async function getTXT(mode) {
  var trans = document.getElementById("translation").value;
  if (trans == "") {
    trans = getUrlVars()["vers"]; //if translation not clear from dropdown, then use URL parameter
  }
  var request;

  // Switch statement for request location. (search button, next/prev Chapter button, default page RESPECTIVELY)
  if (mode == 1) {
    var str = document.getElementById("reference").value;
    request = esvapi_url + str;
    // Next Chapter
  } else if (mode == 0) {
    refRedirect(next.join('-'), getUrlVars()["vers"]);
    // Previous Chapter
  } else if (mode == 2) {
    refRedirect(prev.join('-'), getUrlVars()["vers"]);
    // Default upon launch
  } else if (mode == 3) {
    request = esvapi_url + "Genesis1";
  }
  console.log(request);

  //Send Fetch request as a test of input
  const response = await fetch(request, ESVoptions);
  const data = await response.json();
  console.log(data);

  //If ESV API didn't find a Bible chapter, then redirect it as a search
  if (data.canonical === "") {
    searchRedirect(document.getElementById("reference").value);
  } else { // else use it as a passage.
    refRedirect(data.canonical, trans);
  }

  document.getElementById("reference").value = "";

}
/**
 * getSRC function
 * Gets search results from the API and populates the main section of the page with
 * these search results.
 */
export async function getSRC() {
  let params = {
    'page_size': '100'
  }
  //--- Get Search Results ---
  var request = "https://api.esv.org/v3/passage/search/?q=" + getUrlVars()["search"];
  const response = await fetch(request + "&" + (new URLSearchParams(params)).toString(), ESVoptions);
  const data = await response.json();
  //--- Populate page with search results ---
  console.log(data);
  document.getElementById("main").innerHTML = "";
  for (let i = 0; i < data.results.length; i++) {

    document.getElementById("main").innerHTML += "<div class=\"Divtext" + i + "\">" + data.results[i].reference + "</div>" + data.results[i].content + "<br><br>";
  }


}
//Get actual chapter content and display
export async function getCPT() {
  console.log("getCPT() was called");
  var trans = getUrlVars()["vers"];
  if (trans == "" || trans == "undefined") { trans = "ESV"; } //default to ESV
  var ref = getUrlVars()["ref"];
  if (ref == "") { ref = "Genesis 1"; } //default to Gen1
  if (trans == "ESV") {
    await executeESVAPI(ref);
  } else {
    await executeBIBAPI(trans, ref);
  }
  if (isLoggedIn) {
    indicateNotes(canon);
    showHighlight(canon);
  }
  
}

//Begin fetching from ESV API
async function executeESVAPI(ref) {
  let params = {
    'include-chapter-numbers': 'False',
    'include-audio-link': 'False'
  }
  var request = esvapi_url + ref;
  const response = await fetch(request + "&" + (new URLSearchParams(params)).toString(), ESVoptions);
  const data = await response.json();
  console.log(data);
  document.getElementById("main").innerHTML = data.passages;
  next = data.passage_meta[0].next_chapter;
  prev = data.passage_meta[0].prev_chapter;
  canon = data.canonical;
  console.log("set canon: "+canon);
}

//Begin fetching from BIB API
async function executeBIBAPI(trans, ref) {
  let params = {
    'include-chapter-numbers': 'false',
    'include-titles': 'true',
    'content-type': 'json',
    'include-notes': 'true'
  };
  ref = parseRef(ref);
  var request = "https://api.scripture.api.bible/v1/bibles/" + versMap.get(trans) + "/chapters/" + ref + "?";
  for (let k in params) {
    request += k + "=" + params[k] + "&";
  }
  const response = await fetch(request, apiBibOptions);
  const data = await response.json();

  if (data.statusCode >= 400) {
    console.log(request);
    console.log(data);
    document.getElementById("main").innerHTML = "<h2>Not supported yet or doesnt exist!</h2>";
  } else {
    nonESVPrintText(data);
    next = [data.data.next.id];
    prev = [data.data.previous.id];
    canon = data.data.reference;
  }
}

//Helper function to hide ugly parsing nested loops
//Prints out Bible chapter verse by verse in span tags.
//arg content: json object returned by BibAPI
function nonESVPrintText(datas) {
  var content = datas.data.content;
  var pastetext = "";
  document.getElementById("main").innerHTML = "<h2>" + datas.data.reference + "</h2><br>";
  for (var i = 0; i < content.length; i++) {
    for (var j = 0; j < content[i].items.length; j++) {
      if (content[i].items[j].type == "tag" && content[i].items[j].name == "verse") { //If we are on a verse, then
        document.getElementById("main").innerHTML += "<span>" + pastetext + "</span>";
        pastetext = "";
      }
      if (content[i].items[j].type == "text") {
        pastetext += content[i].items[j].text;
      } else {
        for (var k = 0; k < content[i].items[j].items.length; k++) {
          if (content[i].items[j].name == "verse") {
            pastetext += "<b>" + content[i].items[j].items[k].text + "</b> "
          } else {
            pastetext += content[i].items[j].items[k].text;
          }
        }
      }
    }
  }
}


//Auto page navigation

function parseRef(ref) {
  var i;
  var nums = "1234567890";
  ref = ref.replace(":", ".");
  var myArray = ref.split("%20");
  console.log(ref);
  console.log(myArray);
  //Not a book of form "1 Corinthians, 2 Corinthians..."
  if (myArray.length == 1) {
    return ref;
  } else {
    if (nums.indexOf(myArray[0]) == -1) {
      var toReturn = bookMap.get(myArray[0]);
      i = 1;
    } else {
      var toReturn = bookMap.get(myArray[0] + " " + myArray[1]);
      i = 2;
    }
    for (; i < myArray.length; i++) {
      toReturn += ("." + myArray[i]);
    }
    console.log(toReturn);
    return toReturn;
  }
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

function searchRedirect(loc) {
  window.location = "searchResults.html?search=" + loc;
}

function refRedirect(loc, trans) {
  window.location = "index.html?ref=" + loc + "&vers=" + trans;
}

//darkmode
export function darkmode() {
  var element = document.body;
  element.classList.toggle("darkmode");
}

//Click search results
document.addEventListener("DOMContentLoaded", function () {
  $('#main').on('DOMSubtreeModified', function () {
    $("#main div").off();
    $("#main div").on("click", function () {
      const num = parseInt($(this).attr("class").replace('Divtext', ''), 10);
      console.log(num);
      var mytext = $('.Divtext' + num).text();
      mytext = mytext.substring(0, mytext.indexOf(":"));
      console.log(mytext);
      refRedirect(mytext, "ESV");
    });
  });
});

<<<<<<< HEAD
//Note Database methods

import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDatabase, ref as dbref, set, onValue } from 'firebase/database';
import { getUserEmail, getUID, login } from '../src/account.js';
import { generateID } from './prayerjar.js';

export function addNote(note, ref) {
  const db = getDatabase();
  let noteID = generateID(10);
  set(dbref(db, 'users/' + auth.currentUser.uid +'/notes/'+ref+'/'+noteID), {
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

import { doc, getDoc, collectionGroup, query, where, getDocs } from "firebase/firestore";

function indicateNotes(ref) {
  const db = getDatabase();
  const noteRef = dbref(db, 'users/'+auth.currentUser.uid+'/notes/'+ref);
  onValue(noteRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      document.getElementById("noteChart").innerHTML += "<div>" + "reference: " + childSnapshot.val().reference + "</div>";
      document.getElementById("noteChart").innerHTML += "<div>" + "text: " + childSnapshot.val().text + "</div>";
      document.getElementById("noteChart").innerHTML += "<div>" + "date: " + childSnapshot.val().timestamp + "</div>" + "<br><br>";
    });
  });
}

=======
>>>>>>> 2b585401ca743dc14e3b98b68f80b0fb32263cf6
//Highlights

var element;

export function toggleHighlight(color) {
  $(element).toggleClass(color + "Highlight");
  document.getElementById('highlightDropdown').style.display = "none";
  console.log("element.value: " + element.innerText);
  addHighlight(color, canon ,element.id, element.innerText);
}

//Highlight Jquery

document.addEventListener("DOMContentLoaded", function () {
  $('#main').on('DOMSubtreeModified', function () {
    $("#main span").off();
    $("#main span").on('click', toggleDropdown);
  });

});

document.addEventListener("DOMContentLoaded", function () {
  $('#main').on('DOMSubtreeModified', function () {
    $("#main p").off();
    $("#main p").on('click', toggleDropdown);
  });

});

function toggleDropdown() {
  var dd = document.getElementById('highlightDropdown');
  if (dd.style.display == "none") {
    dd.style.display = 'block';
  } else { dd.style.display = 'none'; }
  element = this;
}

//Highlights to DB
export function addHighlight(color, ref, verse, text) {
  console.log("Highlight added (hopefully)");
  const db = getDatabase();
  set(dbref(db, 'users/' + auth.currentUser.uid + '/highlights/'+ref+'/'+verse), {
    reference: ref,
    color: color,
    verse: verse,
    text: text,
    timestamp: serverTimestamp()
  });
}

//Get highlights from DB
export function getHighlight() {
  if (!isLoggedIn) {
    console.log('not logged in!');
    login();
  }
  const db = getDatabase();
  const highRef = dbref(db, 'users/'+auth.currentUser.uid+'/highlights');
  onValue(highRef,(snapshot) => {
    snapshot.forEach((childSnapshot) => {
      childSnapshot.forEach((childChildSnapshot) => {
        document.getElementById("main").innerHTML += "<div>" + "reference: " + childChildSnapshot.val().text + "</div>";
      });
    });
  });
}

function showHighlight(ref) {
  console.log("ShowHighlight called");
  const db = getDatabase();
  const currentChapter = dbref(db, 'users/'+auth.currentUser.uid+'/highlights/'+ref+'/');
  onValue(currentChapter, (snapshot) => {
    console.log("onValue in showHighlight");
    snapshot.forEach((childSnapshot) => {
      console.log("ref: " + ref);
      console.log("reference: " + childSnapshot.val().reference);
      if (childSnapshot.val().reference === ref) {
        document.getElementById(childSnapshot.val().verse).classList.add(childSnapshot.val().color + "Highlight");
      }
    });
  });
}
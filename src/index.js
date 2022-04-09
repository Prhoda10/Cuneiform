import {bookMap, versMap} from '../src/initialization.js'
//fetch API
var esvapi_url = 'https://api.esv.org/v3/passage/html/?q=';

import { ESVoptions, apiBibOptions } from '../src/myAPIKey.js';

let next = [];
let prev = [];
export var canon = "";

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
  var trans = getUrlVars()["vers"];
  if (trans == "" || trans == "undefined") { trans = "ESV"; } //default to ESV
  var ref = getUrlVars()["ref"];
  if (ref == "") { ref = "Gen1"; } //default to Gen1
  if (trans == "ESV") {
    executeESVAPI(ref);
  } else {
    executeBIBAPI(trans, ref);
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
    for(var j = 0; j < content[i].items.length; j++) {
      if(content[i].items[j].type == "tag" && content[i].items[j].name == "verse") { //If we are on a verse, then
        document.getElementById("main").innerHTML += "<span>" + pastetext + "</span>";
        pastetext = "";
      }
      if(content[i].items[j].type == "text") {
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
    $("#main div").on("click",function () {
      const num = parseInt($(this).attr("class").replace('Divtext', ''), 10);
      console.log(num);
      var mytext = $('.Divtext' + num).text();
      mytext = mytext.substring(0, mytext.indexOf(":"));
      console.log(mytext);
      refRedirect(mytext, "ESV");
    });
  });
});

//Note Database methods

import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function addNote(note, ref) {
  try {
    const docRef = await addDoc(collection(getFirestore(), 'note'), {
      reference: ref,
      text: note,
      timestamp: serverTimestamp()
    });
    console.log("Note Submitted: ", docRef.id);
  }
  catch(error) {
    console.error('Error writing new note to Firebase Firestore Database', error);
  }
}

import { doc, getDoc, collectionGroup, query, where, getDocs } from "firebase/firestore";
export async function readNote() {
  console.log("readNote Called");

  const myNotes = query(collectionGroup(getFirestore(), 'note'));
  const querySnapshot = await getDocs(myNotes);
  querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
      document.getElementById("main").innerHTML += "<div>" + "reference: " + doc.data().reference + "</div>";
      document.getElementById("main").innerHTML += "<div>" + "text: " + doc.data().text + "</div>";
      document.getElementById("main").innerHTML += "<div>" + "date: " + doc.data().timestamp + "</div>"+ "<br><br>";

  });
}

//Highlights

var element;

export function toggleHighlight(color) {
  $(element).toggleClass(color + "Highlight");
  document.getElementById('highlightDropdown').style.display = "none";
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

//Toggle the dropdown for highlights
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
// function dropdown() {
//   document.getElementById("dropdown-content").classList.toggle("show");
// }

// Close the dropdown menu if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('#main p')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }
import { initializeApp } from 'firebase/app';

const app = initializeApp( {
  apiKey: "AIzaSyBdfLZLTXIK3dFvMUR7R0vOWwC01iceGAo",
  authDomain: "cuneiform-99812.firebaseapp.com",
  databaseURL: "https://cuneiform-99812-default-rtdb.firebaseio.com",
  projectId: "cuneiform-99812",
  storageBucket: "cuneiform-99812.appspot.com",
  messagingSenderId: "294328255555",
  appId: "1:294328255555:web:a47d8083d73fe98aafc0f6",
  measurementId: "G-9PGSSD2423"
});

import { getDatabase, ref } from 'firebase/database';
import { getFirestore, collection, getDocs, getDoc } from 'firebase/firestore';
///import { set } from 'lodash';

// function writeUserData(userId, name, email, imageUrl) {
//   const db = getDatabase(app);
//   const reference = ref(db, 'users/' +userId);
//   set(reference, {
//   username: name,
//   email: email,
//   profile_picture: imageUrl
// });
// }

// writeUserData("gloriakim", "gloria", "gloria.kim@my.wheaton.edu", "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi2.wp.com%2Frehabilitationadvantage.com%2Fwp-content%2Fuploads%2F2018%2F09%2F1-7.png%3Ffit%3D2550%252C2550%26ssl%3D1&f=1&nofb=1")
// */

document.addEventListener('DOMContentLoaded', () => {
  tranSetUp();
  getCPT();
});

document.getElementById("toggleVerse").addEventListener("click", () => {
  getTXT(1);
});
document.getElementById("darkBut").addEventListener("click", darkmode);
document.getElementById("prevChapter").addEventListener("click", () => {
  getTXT(2);
});
document.getElementById("nextChapter").addEventListener("click", () => {
  getTXT(0);
});
document.addEventListener('keydown', () => {
  if (event.keyCode == 13) getTXT(1)
})


//fetch API
var esvapi_url = 'https://api.esv.org/v3/passage/html/?q=';
//var apiBib_url = 'https://api.scripture.api.bible/v1/bibles/';

var versMap = new Map([
  ['ASV','06125adad2d5898a-01'],
  ['KJV','de4e12af7f28f599-02'],
  ['Reina%20Valera%201909','592420522e16049f-01'],
  ['The%20Holy%20Bible%20in%20Simple%20Spanish','b32b9d1b64b4ef29-01'],
  ['VBL','482ddd53705278cc-01'],
  ['grcF35','5e29945cf530b0f6-01'],
  ['Vietnamese%20Bible%201934','1b878de073afef07-01'],
  ['Open%20Vietnamese%20Contemporary%20Bible','5cc7093967a0a392-01'],
  ['Thai%20KJV','2eb94132ad61ae75-01'],
  ['Open%20Kiswahili%20Contemporary%20Version','611f8eb23aec8f13-01'],
  ['Swedish%20Core%20Bible','fa4317c59f0825e0-01'],
  ['Gdansk%20Bible','1c9761e0230da6e0-01'],
  ['Catholic%20Dutch%20Bible%201939','ead7b4cc5007389c-01'],
  ['Diodati%20Bible','41f25b97f468e10b-01'],
  ['Plain%20Indonesian%20Translation','2dd568eeff29fb3c-02'],
  ['Indian%20Revised%20Version%20(Hindi)','1e8ab327edbce67f-01'],
  ['Open%20Hebrew%20Living%20New%20Testament','a8a97eebae3c98e4-01'],
  ['Elderfelder%20Translation','f492a38d0e52db0f-01'],
  ['German%20Luther%20Bible','926aa5efbc5e04e2-01'],
  ['German%20Unrevised%20elberfelder%20Bible','95410db44ef800c1-01'],
  ['Czech%20Kralická%20Bible%201613','c61908161b077c4c-01'],
  ['Indian%20Revised%20Version%20(Bengali)','4c3eda00cd317568-01'],
  ['NTPrv','17c44f6c89de00db-01'],
  ['New%20Arabic%20Version','b17e246951402e50-01']
]);

var bookMap = new Map([
  ['Genesis','GEN'],['Exodus','EXO'],['Leviticus','LEV'],['Numbers','NUM'],['Deuteronomy','DEU'],['Joshua','JOS'],['Judges','JDG'],['Ruth','RUT'],
  ['1 Samuel','1SA'],['2 Samuel','2SA'],['1 Kings','1KI'],['2 Kings','2KI'],['1 Chronicles','1CH'],['2 Chronicles','2CH'],['Ezra','EZR'],['Nehemiah','NEH'],['Ester','EST'],['Job','JOB'],
  ['Psalm','PSA'],['Proverbs','PRO'],['Ecclesiastes','ECC'],['Song of Solomon','SNG'],['Isaiah','ISA'],['Jeremiah','JER'],['Lamentations','LAM'],
  ['Ezekiel','EZK'],['Daniel','DAN'],['Hosea','HOS'],['Joel','JOL'],['Amos','AMO'],['Obadiah','OBA'],['Jonah','JON'],['Micah','MIC'],['Nahum','NAM'],
  ['Habakkuk','HAB'],['Zephaniah','ZEP'],['Haggai','HAG'],['Zechariah','ZEC'],['Malachi','MAL'],['Matthew','MAT'],['Mark','MRK'],['Luke','LUK'],
  ['John','JHN'],['Acts','ACT'],['Romans','ROM'],['1 Corinthians','1CO'],['2 Corinthians','2CO'],['Galatians','GAL'],['Ephesians','EPH'],['Philippians','PHP'],
  ['Colossians','COL'],['1 Thessalonians','1TH'],['2 Thessalonians','2TH'],['1 Timothy','1TI'],['2 Timothy','2TI'],['Titus','TIT'],['Philemon','PHM'],
  ['Hebrews','HEB'],['James','JAS'],['1 Peter','1PE'],['2 Peter','2PE'],['1 John','1JN'],['2 John','2JN'],['2 John','2JN'],['Jude','JUD'],['Revelation','REV']
]);

const ESVoptions = {
  headers: {
    Authorization: "Token abefecf1787b77af8b490d6056e2691433f6d3d4"
  }
};
const apiBibOptions = {
  headers: {
    "api-key": "232ec92dbff52f241c17a807c867c8c8"
  }
};
let next = [];
let prev = [];

//Check if its a search or a reference
async function getTXT(mode) {
  var trans = document.getElementById("translation").value;
  if (trans == "") {
    trans = getUrlVars()["vers"];
  }
  let params = {
    'include-chapter-numbers': 'False',
    'include-audio-link': 'False'
  }
  var request;
  // From Text Input
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

  const response = await fetch(request + "&" + (new URLSearchParams(params)).toString(), ESVoptions);
  const data = await response.json();
  console.log(data);
  
  if (data.canonical === "") {
    //getSRC();
    searchRedirect(document.getElementById("reference").value);
  } else {
    refRedirect(data.canonical, trans);
  }

  document.getElementById("reference").value = "";

}
/**
 * getSRC function
 * Gets search results from the API and populates the main section of the page with
 * these search results.
 */
async function getSRC() {
  let params = {
    'page_size' : '100'
  }
  //--- Get Search Results ---
  var request = "https://api.esv.org/v3/passage/search/?q=" + getUrlVars()["search"];
  const response = await fetch(request + "&" + (new URLSearchParams(params)).toString(), ESVoptions);
  const data = await response.json();
  // document.getElementById("main").innerHTML = data.results[1].reference;
  // document.getElementById("main").innerHTML += data.results[1].reference;
  //--- Populate page with search results ---
  console.log(data);
  document.getElementById("main").innerHTML = "";
  for (let i = 0; i < data.results.length; i++) {
    document.getElementById("main").innerHTML += "<div>" + data.results[i].reference + "</div>" + data.results[i].content + "<br><br>";
  }

}
//Get chapter
async function getCPT() {
  var trans = getUrlVars()["vers"];
  if (trans == "" || trans == "undefined") { trans = "ESV";}
  var ref = getUrlVars()["ref"];
  if (ref == "") {
    ref = "Gen1";
  }
  if (trans == "ESV") {
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
  } else {
    let params = {
      'include-chapter-numbers': 'false',
      'include-titles': 'true'
    };
    ref = parseRef(ref);
    var request = "https://api.scripture.api.bible/v1/bibles/" + versMap.get(trans) + "/chapters/" + ref + "?";
    for(let k in params) {
      request += k + "=" + params[k] + "&";
    }
    const response = await fetch(request/* + "&" + (new URLSearchParams(params)).toString()*/, apiBibOptions);
    const data = await response.json();
    if (data.statusCode >= 400) {
      console.log(request);
      console.log(data);
      document.getElementById("main").innerHTML = "<h2>Not supported yet or doesnt exist!</h2>";
    } else {
      console.log(data);
      document.getElementById("main").innerHTML = "<h2>" + data.data.reference + "</h2><br>" + data.data.content;
      next = [data.data.next.id];
      prev = [data.data.previous.id];
    }
  }
}

function parseRef(ref) {
  var i;
  var nums = "1234567890";
  ref = ref.replace(":",".");
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
    for (;i < myArray.length;i++) {
      toReturn += ("." + myArray[i]);
    }
    console.log(toReturn);
    return toReturn;
  }
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
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
function darkmode() {
  var element = document.body;
  element.classList.toggle("darkmode");
}


// Show different options for translation based on language selected
function tranSetUp() {
  var langObj1 = ["English","Spanish","Ancient Greek","Arabic",'Belarusian',"Bengali","Czech","German","Hebrew (Modern)","Hindi","Indonesian",
                  "Italian","Dutch","Polish","Swedish","Swahili","Thai","Vietnamese"];
  var langObj2 = [
    ["ESV","KJV","ASV"],/*English*/
    ["Reina Valera 1909", "The Holy Bible in Simple Spanish","VBL"],/*Spanish*/
    ["grcF35"],/*Ancient Greek*/
    ["New Arabic Version"],/*Arabic*/
    ["NTPrv"],/*Belarusan*/
    ["Indian Revised Version (Bengali)"],/*Bengali*/
    ["Czech Kralická Bible 1613"],/*Czech*/
    ["German Unrevised elberfelder Bible","German Luther Bible","Elderfelder Translation"],/*German*/
    ["Open Hebrew Living New Testament"],/*Hebrew*/
    ["Indian Revised Version (Hindi)"],/*Hindi*/
    ["Plain Indonesian Translation"],/*Indonesian*/
    ["Diodati Bible"],/*Italian*/
    ["Catholic Dutch Bible 1939"],/*Dutch*/
    ["Gdansk Bible"],/*Polish*/
    ["Swedish Core Bible"],/*Swedish*/
    ["Open Kiswahili Contemporary Version"],/*Swahili*/
    ["Thai KJV"],/*Thai*/
    ["Open Vietnamese Contemporary Bible","Vietnamese Bible 1934"]/*Vietnamese*/
  ];

  console.log("tranSetUP called");
  var langSel = document.getElementById("langu");
  var tranSel = document.getElementById("translation");
  for (var i = 0; i < langObj1.length; i++) {
    langSel.options[langSel.options.length] = new Option(langObj1[i], langObj1[i]);
  }
  langSel.onchange = function() {

    tranSel.length = 1;
    var index = langObj1.indexOf(this.value);
    var z = langObj2[index];
    console.log("tranSetUP called");
    for (var i = 0; i < z.length; i++) {
      tranSel.options[tranSel.options.length] = new Option(z[i], z[i]);
    }
  }
}

//Highlight
$(document).ready(function () {
  $('#main').on('DOMSubtreeModified', function () {
     $("#main p").off();
     $("#main p").click(function () {
        $(this).toggleClass("highlight");
     });
  });

});

//signin 
/*
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

/// Sign in event handlers

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();
*/
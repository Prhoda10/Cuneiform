/* This file initializes our app - 
* allows firebase to work
* connects functions from separate js files to appropriate html files
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

console.log("firebase initialized");
import { getDatabase, ref as sRef, set } from 'firebase/database';

//testing a function to use the realtime database
function writeUserData(userId, name, email) {
  const db = getDatabase();
  set(sRef(db, 'users/' + userId), {
    username: name,
    email: email,
  });
}

// Show different options for translation based on language selected
function tranSetUp() {
  var langObj1 = ["English", "Spanish", "Ancient Greek", "Arabic", 'Belarusian', "Bengali", "Czech", "German", "Hebrew (Modern)", "Hindi", "Indonesian",
    "Italian", "Dutch", "Polish", "Swedish", "Swahili", "Thai", "Vietnamese"];
  var langObj2 = [
    ["ESV", "KJV", "ASV"],/*English*/
    ["Reina Valera 1909", "The Holy Bible in Simple Spanish", "VBL"],/*Spanish*/
    ["grcF35"],/*Ancient Greek*/
    ["New Arabic Version"],/*Arabic*/
    ["NTPrv"],/*Belarusan*/
    ["Indian Revised Version (Bengali)"],/*Bengali*/
    ["Czech Kralická Bible 1613"],/*Czech*/
    ["German Unrevised elberfelder Bible", "German Luther Bible", "Elderfelder Translation"],/*German*/
    ["Open Hebrew Living New Testament"],/*Hebrew*/
    ["Indian Revised Version (Hindi)"],/*Hindi*/
    ["Plain Indonesian Translation"],/*Indonesian*/
    ["Diodati Bible"],/*Italian*/
    ["Catholic Dutch Bible 1939"],/*Dutch*/
    ["Gdansk Bible"],/*Polish*/
    ["Swedish Core Bible"],/*Swedish*/
    ["Open Kiswahili Contemporary Version"],/*Swahili*/
    ["Thai KJV"],/*Thai*/
    ["Open Vietnamese Contemporary Bible", "Vietnamese Bible 1934"]/*Vietnamese*/
  ];

  console.log("tranSetUP called");
  var langSel = document.getElementById("langu");
  var tranSel = document.getElementById("translation");
  for (var i = 0; i < langObj1.length; i++) {
    langSel.options[langSel.options.length] = new Option(langObj1[i], langObj1[i]);
  }
  langSel.onchange = function () {

    tranSel.length = 1;
    var index = langObj1.indexOf(this.value);
    var z = langObj2[index];
    console.log("tranSetUP called");
    for (var i = 0; i < z.length; i++) {
      tranSel.options[tranSel.options.length] = new Option(z[i], z[i]);
    }
  }
}


// Maps for translations and API Querying
export var versMap = new Map([
  ['ASV', '06125adad2d5898a-01'],
  ['KJV', 'de4e12af7f28f599-02'],
  ['Reina%20Valera%201909', '592420522e16049f-01'],
  ['The%20Holy%20Bible%20in%20Simple%20Spanish', 'b32b9d1b64b4ef29-01'],
  ['VBL', '482ddd53705278cc-01'],
  ['grcF35', '5e29945cf530b0f6-01'],
  ['Vietnamese%20Bible%201934', '1b878de073afef07-01'],
  ['Open%20Vietnamese%20Contemporary%20Bible', '5cc7093967a0a392-01'],
  ['Thai%20KJV', '2eb94132ad61ae75-01'],
  ['Open%20Kiswahili%20Contemporary%20Version', '611f8eb23aec8f13-01'],
  ['Swedish%20Core%20Bible', 'fa4317c59f0825e0-01'],
  ['Gdansk%20Bible', '1c9761e0230da6e0-01'],
  ['Catholic%20Dutch%20Bible%201939', 'ead7b4cc5007389c-01'],
  ['Diodati%20Bible', '41f25b97f468e10b-01'],
  ['Plain%20Indonesian%20Translation', '2dd568eeff29fb3c-02'],
  ['Indian%20Revised%20Version%20(Hindi)', '1e8ab327edbce67f-01'],
  ['Open%20Hebrew%20Living%20New%20Testament', 'a8a97eebae3c98e4-01'],
  ['Elderfelder%20Translation', 'f492a38d0e52db0f-01'],
  ['German%20Luther%20Bible', '926aa5efbc5e04e2-01'],
  ['German%20Unrevised%20elberfelder%20Bible', '95410db44ef800c1-01'],
  ['Czech%20Kralická%20Bible%201613', 'c61908161b077c4c-01'],
  ['Indian%20Revised%20Version%20(Bengali)', '4c3eda00cd317568-01'],
  ['NTPrv', '17c44f6c89de00db-01'],
  ['New%20Arabic%20Version', 'b17e246951402e50-01']
]);

export var bookMap = new Map([
  ['Genesis', 'GEN'], ['Exodus', 'EXO'], ['Leviticus', 'LEV'], ['Numbers', 'NUM'], ['Deuteronomy', 'DEU'], ['Joshua', 'JOS'], ['Judges', 'JDG'], ['Ruth', 'RUT'],
  ['1 Samuel', '1SA'], ['2 Samuel', '2SA'], ['1 Kings', '1KI'], ['2 Kings', '2KI'], ['1 Chronicles', '1CH'], ['2 Chronicles', '2CH'], ['Ezra', 'EZR'], ['Nehemiah', 'NEH'], ['Ester', 'EST'], ['Job', 'JOB'],
  ['Psalm', 'PSA'], ['Proverbs', 'PRO'], ['Ecclesiastes', 'ECC'], ['Song of Solomon', 'SNG'], ['Isaiah', 'ISA'], ['Jeremiah', 'JER'], ['Lamentations', 'LAM'],
  ['Ezekiel', 'EZK'], ['Daniel', 'DAN'], ['Hosea', 'HOS'], ['Joel', 'JOL'], ['Amos', 'AMO'], ['Obadiah', 'OBA'], ['Jonah', 'JON'], ['Micah', 'MIC'], ['Nahum', 'NAM'],
  ['Habakkuk', 'HAB'], ['Zephaniah', 'ZEP'], ['Haggai', 'HAG'], ['Zechariah', 'ZEC'], ['Malachi', 'MAL'], ['Matthew', 'MAT'], ['Mark', 'MRK'], ['Luke', 'LUK'],
  ['John', 'JHN'], ['Acts', 'ACT'], ['Romans', 'ROM'], ['1 Corinthians', '1CO'], ['2 Corinthians', '2CO'], ['Galatians', 'GAL'], ['Ephesians', 'EPH'], ['Philippians', 'PHP'],
  ['Colossians', 'COL'], ['1 Thessalonians', '1TH'], ['2 Thessalonians', '2TH'], ['1 Timothy', '1TI'], ['2 Timothy', '2TI'], ['Titus', 'TIT'], ['Philemon', 'PHM'],
  ['Hebrews', 'HEB'], ['James', 'JAS'], ['1 Peter', '1PE'], ['2 Peter', '2PE'], ['1 John', '1JN'], ['2 John', '2JN'], ['2 John', '2JN'], ['Jude', 'JUD'], ['Revelation', 'REV']
]);


/* connecting functions to html */
//set up translations, then either get search results or the chapter

import { getSRC, getCPT, getTXT, darkmode, toggleHighlight, getHighlight } from '../src/index.js';
import { addNote } from '../src/notes.js';

var p = window.location.pathname;
var onIndex = (p.length === 0 || p === "/" || p.match('index.html') != null);
if (window.location.href.includes("index")||window.location.href.includes("search") || onIndex) {
  console.log("This is the index page")
  document.addEventListener('DOMContentLoaded', () => {
    tranSetUp();
    if (window.location.href.includes("search")) {
      getSRC();
    } else {
      getCPT();
    }
  });
}

if (window.location.href.includes("note")) {
  console.log("This is the note page")
  document.addEventListener('DOMContentLoaded', () => {
    //tranSetUp();
    //readNote();
  });
}

if (window.location.href.includes("highlights")) {
  console.log("This is the highlight page")
  document.addEventListener('DOMContentLoaded', () => {
    //tranSetUp();
    getHighlight();
  });
}

// EventListeners for html objects

if (document.getElementById("toggleVerse")) {
  document.getElementById("toggleVerse").addEventListener("click", () => {
    getTXT(1);
  });
}
if (document.getElementById("darkBut")) {
  document.getElementById("darkBut").addEventListener("click", darkmode);
}
if (document.getElementById("prevChapter")) {
  document.getElementById("prevChapter").addEventListener("click", () => {
    getTXT(2);
  });
  document.getElementById("nextChapter").addEventListener("click", () => {
    getTXT(0);
  });
}

document.addEventListener('keydown', () => {
  if (event.keyCode == 13) getTXT(1)
})

//Highlight ActionListeners

//"Cant find elemenybyID when hid initially, so we hide it during the static execution of this file."
if (document.getElementById('highlightDropdown')){
  document.getElementById('highlightDropdown').style.display = "none";


document.getElementById("redButton").addEventListener("click", () => {
  toggleHighlight("red");
});
document.getElementById("orangeButton").addEventListener("click", () => {
  toggleHighlight("orange");
});
document.getElementById("greenButton").addEventListener("click", () => {
  toggleHighlight("green");
});
document.getElementById("blueButton").addEventListener("click", () => {
  toggleHighlight("blue");
});
document.getElementById("purpleButton").addEventListener("click", () => {
  toggleHighlight("purple");
});
document.getElementById("yellowButton").addEventListener("click", () => {
  toggleHighlight("yellow");
});
}
//Note button Action Listeners
import { canon } from '../src/index.js';
import { login, isLoggedIn, getUserEmail } from '../src/account.js';

if(document.getElementById("noteButton")) {
document.getElementById("noteButton").addEventListener("click", () => {
  console.log('log: ' + isLoggedIn());
    if (isLoggedIn()) {
    console.log('email: '+ getUserEmail());
    document.getElementById("noteRef").innerHTML = canon;
    document.getElementById('myForm').style.display = "block";
  } else {
    login();
  }
});

document.getElementById("cancelButton").addEventListener("click", () => {
  document.getElementById('myForm').style.display = "none";
});

document.getElementById("saveButton").addEventListener("click", () => {
  addNote(document.getElementById('NOTE').value, document.getElementById('noteRef').innerHTML);
  document.getElementById('myForm').style.display = "none";
});
}
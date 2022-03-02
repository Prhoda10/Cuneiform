
//fetch API
var api_url = 'https://api.esv.org/v3/passage/html/?q='
const options = {
  headers: {
    Authorization: "Token abefecf1787b77af8b490d6056e2691433f6d3d4"
  }
};
let next = [];
let prev = [];

//Check if its a search or a reference
async function getTXT(mode) {
  let params = {
    'include-chapter-numbers': 'False',
    'include-audio-link': 'False'
  }
  var request;
  // From Text Input
  if (mode == 1) {
    //var str1 = document.getElementById("book").value;
    var str = document.getElementById("reference").value;
    request = api_url + str;
    // Next Chapter
  } else if (mode == 0) {
    request = api_url + next.join('-');
    // Previous Chapter
  } else if (mode == 2) {
    request = api_url + prev.join('-');
    // Default upon launch
  } else if (mode == 3) {
    request = api_url + "Genesis1";
  }
  console.log(request);

  const response = await fetch(request + "&" + (new URLSearchParams(params)).toString(), options);
  const data = await response.json();
  console.log(data);
  
  if (data.canonical === "") {
    //getSRC();
    searchRedirect(document.getElementById("reference").value);
  } else {
    refRedirect(document.getElementById("reference").value);
    //document.getElementById("main").innerHTML = data.passages;
    // next = data.passage_meta[0].next_chapter;
    // prev = data.passage_meta[0].prev_chapter;
  }

  document.getElementById("reference").value = "";

}

//Get Search Results
async function getSRC() {
  let params = {
    'page_size' : '100'
  }
  var request = "https://api.esv.org/v3/passage/search/?q=" + getUrlVars()["search"];
  const response = await fetch(request + "&" + (new URLSearchParams(params)).toString(), options);
  const data = await response.json();
  // document.getElementById("main").innerHTML = data.results[1].reference;
  // document.getElementById("main").innerHTML += data.results[1].reference;

  console.log(data);
  document.getElementById("main").innerHTML = "";
  for (let i = 0; i < data.results.length; i++) {
    document.getElementById("main").innerHTML += data.results[i].reference + "<br>" + data.results[i].content + "<br><br>";
  }

}
//Get chapter
async function getCPT() {
  let params = {
    'include-chapter-numbers': 'False',
    'include-audio-link': 'False'
  }
  var ref = getUrlVars()["ref"];
  if (ref == "") {
    ref = "Gen1";
  }
  var request = api_url + ref;
  const response = await fetch(request + "&" + (new URLSearchParams(params)).toString(), options);
  const data = await response.json();
  console.log(data);
  document.getElementById("main").innerHTML = data.passages;
  next = data.passage_meta[0].next_chapter;
  prev = data.passage_meta[0].prev_chapter;
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

// Proceed on 'Enter' Key
var navBox = document.getElementById("reference");
// navBox.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     document.getElementById("toggleVerse").click();
//     getTXT(1);
//   }
// });

navBox.addEventListener("keypress", handleEnter, false);

function handleEnterRef() {
  if(event.key == "Enter") {
    event.preventDefault();
    document.getElementById("toggleVerse").click();
  }
}

function searchRedirect(loc) {
  window.location = "searchResults.html?search=" + loc;
}

function refRedirect(loc) {
  window.location = "index.html?ref=" + loc;
}

//darkmode
function darkmode() {
  var element = document.body;
  element.classList.toggle("darkmode");
}

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
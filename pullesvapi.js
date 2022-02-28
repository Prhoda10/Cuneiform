//fetch API
var api_url = 'https://api.esv.org/v3/passage/html/?q='
const options = {
  headers: {
    Authorization: "Token abefecf1787b77af8b490d6056e2691433f6d3d4"
  }
};
let next = [];
let prev = [];

//display text
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
    alert("Invalid entry");
  } else {
    document.getElementById("main").innerHTML = data.passages;
    next = data.passage_meta[0].next_chapter;
    prev = data.passage_meta[0].prev_chapter;
  }

}

//Get Search Results
async function getSRC() {
  let params = {
    'page_size' : '100'
  }
  var str = document.getElementById("keyWordSearch").value;
  var request = "https://api.esv.org/v3/passage/search/?q=" + str;
  const response = await fetch(request + "&" + (new URLSearchParams(params)).toString(), options);
  const data = await response.json();
  console.log(data);
  document.getElementById("main").innerHTML = "";
  for (let i = 0; i < data.total_results; i++) {
    document.getElementById("main").innerHTML += data.results[i].reference + "<br>" + data.results[i].content + "<br><br>";
  }

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

function handleEnterSRC() {
  if(event.key == "Enter") {
    event.preventDefault();
    document.getElementById("Search").click();
  }
}

//darkmode
function darkmode() {
  var element = document.getElementById("main");
  element.classList.toggle("darkmode");
}

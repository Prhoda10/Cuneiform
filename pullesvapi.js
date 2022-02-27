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
  if (mode == 1) {
    var str = document.getElementById("book").value;
    var str2 = document.getElementById("reference").value;
    request = api_url + str + "+" + str2;
  } else if (mode == 0) {
    request = api_url + next.join('-');
  } else {
    request = api_url + prev.join('-');
  }
  console.log(request);

  const response = await fetch(request + "&" + (new URLSearchParams(params)).toString(), options);
  const data = await response.json();
  document.getElementById("main").innerHTML = data.passages;
  next = data.passage_meta[0].next_chapter;
  prev = data.passage_meta[0].prev_chapter;

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
  // document.getElementById("main").innerHTML = data.results[1].reference;
  // document.getElementById("main").innerHTML += data.results[1].reference;

  document.getElementById("main").innerHTML = "";
  for (let i = 0; i < data.total_results; i++) {
    document.getElementById("main").innerHTML += data.results[i].reference + "<br>" + data.results[i].content + "<br><br>";
  }

}

// this doesn't work yet
var input = document.getElementById("reference");
input.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.key === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    validate(event);
  }
});

function validate(e) {
  getTXT(1);
}

//darkmode
function darkmode() {
  var element = document.getElementById("main");
  element.classList.toggle("darkmode");
}

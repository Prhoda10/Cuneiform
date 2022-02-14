
//fetch API
var api_url = 'https://api.esv.org/v3/passage/text/?q='
const options = {
  headers: {
    Authorization: "Token abefecf1787b77af8b490d6056e2691433f6d3d4"
  }
};

//display text
async function getTXT() {
  var str = document.getElementById("book").value;
  var str2 = document.getElementById("reference").value;
  const request = api_url + str + "+" + str2;
  console.log(request);
  const response = await fetch(request, options);
  const data = await response.json();
  console.log(data);
  // document.getElementById("main").innerHTML = data.passages;
  let output = "";
  function formatTXT(item, index) {
    output += index + ". " + item + "<br/>";
  }
  var text = JSON.stringify(data.passages, null, 5).split(/\[\d{1,}\]/).forEach(formatTXT);

  output = output.replace(/(\n)/, "<br />");
  document.getElementById("main").innerHTML = output;
  console.log(text);
  console.log(output);

}

// this doesn't work yet
var input = document.getElementById("reference");
input.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.key === 'Enter') {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("btn1").click();
  }
});

//darkmode
function darkmode() {
  var element = document.getElementById("main");
  element.classList.toggle("darkmode");
}

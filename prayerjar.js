const unaccepableWords = []; //An array of words banned from prayer requests.
/**
* A function for submiting prayer requests.
*/
function submitPrayer() {
	let list = document.getElementById("prayerList");
	let prayer = document.getElementById("submissionBox").value;
	let li = document.createElement("li");
	if(checkPrayer(prayer, unaccepableWords)) {
		return;
	} else {
		li.setAttribute('id', prayer);
		li.appendChild(document.createTextNode(prayer));
		list.appendChild(li);
		}
}
/**
* A function for remmoving prayer requests.
*/
function removePrayer() {
	let list = document.getElementById("prayerList");
	list.removeChild(list.childNodes[0]);
}
/**
* Checks a string for inapropriate words.
* @param x The string to be checked.
* @param words The list of strings to be checked against.
*/
function checkPrayer(x, words) {
	for(let i = 0; i < words.length; i++) {
		if(x.includes(words[i])) {
			document.getElementById("invalidPrayerInput").innerHTML = "Prayer contains unaccepable language";
			return true;
		}
	}
}
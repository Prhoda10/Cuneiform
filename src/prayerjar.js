import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
// Saves a new message to Cloud Firestore.
async function saveMessage(msg) {
	// Add a new message entry to the Firebase database.
	try {
		const docRef = await addDoc(collection(getFirestore(), 'prayer'), {
			text: msg,
			timestamp: serverTimestamp()
		});
		console.log("Prayer submitted: ", docRef.id);
	}
	catch (error) {
		console.error('Error writing new message to Firebase Database', error);
	}
}

import { query, getDocs } from "firebase/firestore";

async function readMessage() {
	const q = query(collection(getFirestore(), 'prayer'));
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		console.log(doc.id, " => ", doc.data());
		let li = document.createElement("li");
		li.setAttribute('id', prayer);
		li.appendChild(document.createTextNode(doc.data().text));
		document.getElementById("prayerList").appendChild(li)
	})
}

/*
* connect functions to buttons for this specific page
*/
if (window.location.href.includes("prayer")) {
	document.getElementById("submit-prayer").addEventListener("click", submitPrayer);
	document.getElementById("get-prayer").addEventListener("click", removePrayer);
}

const unacceptableWords = []; //An array of words banned from prayer requests.
/**
* A function for submiting prayer requests.
*/
function submitPrayer() {
	let list = document.getElementById("prayerList");
	let prayer = document.getElementById("submissionBox").value;
	let li = document.createElement("li");
	if (checkPrayer(prayer, unacceptableWords)) {
		return;
	} else {
		window.alert("Prayer Submitted!");
		/*li.setAttribute('id', prayer);
		li.appendChild(document.createTextNode(prayer));
		list.appendChild(li);*/
		saveMessage(prayer);
	}
}

/**
* A function for remmoving prayer requests.
*/
function removePrayer() {
	let list = document.getElementById("prayerList");
	while (list.firstChild) {
		list.removeChild(addListener.lastChild);
	}
	readMessage();
}

/**
* Checks a string for inapropriate words.
* @param x The string to be checked.
* @param words The list of strings to be checked against.
*/
function checkPrayer(x, words) {
	for (let i = 0; i < words.length; i++) {
		if (x.includes(words[i])) {
			document.getElementById("invalidPrayerInput").innerHTML = "Prayer contains unacceptable language";
			return true;
		}
	}
	return false;
}
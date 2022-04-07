import { initializeApp } from 'firebase/app';

const firebase = initializeApp({
  apiKey: "AIzaSyBdfLZLTXIK3dFvMUR7R0vOWwC01iceGAo",
  authDomain: "cuneiform-99812.firebaseapp.com",
  databaseURL: "https://cuneiform-99812-default-rtdb.firebaseio.com",
  projectId: "cuneiform-99812",
  storageBucket: "cuneiform-99812.appspot.com",
  messagingSenderId: "294328255555",
  appId: "1:294328255555:web:a47d8083d73fe98aafc0f6",
  measurementId: "G-9PGSSD2423"
});

// import { getDatabase, ref, set, onValue} from "firebase/database";
// const db = getDatabase(firebase);
import { getFirestore, addDoc, collection, ref, set, onValue} from "firebase/firestore";
// Saves a new message to Cloud Firestore.
async function saveMessage(messageText) {
	// Add a new message entry to the Firebase database.
	try {
	  await addDoc(collection(getFirestore(), 'messages'), {
		text: messageText,
	  });
	}
	catch(error) {
	  console.error('Error writing new message to Firebase Database', error);
	}
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
		li.setAttribute('id', prayer);
		li.appendChild(document.createTextNode(prayer));
		list.appendChild(li);
		saveMessage(prayer);
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
	for (let i = 0; i < words.length; i++) {
		if (x.includes(words[i])) {
			document.getElementById("invalidPrayerInput").innerHTML = "Prayer contains unaccepable language";
			return true;
		}
	}
	return false;
}
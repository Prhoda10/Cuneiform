import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query } from "firebase/firestore";
import { getUID } from "./account";

const firebaseConfig = {
	apiKey: "AIzaSyBdfLZLTXIK3dFvMUR7R0vOWwC01iceGAo",
	authDomain: "cuneiform-99812.firebaseapp.com",
	databaseURL: "https://cuneiform-99812-default-rtdb.firebaseio.com",
	projectId: "cuneiform-99812",
	storageBucket: "cuneiform-99812.appspot.com",
	messagingSenderId: "294328255555",
	appId: "1:294328255555:web:a47d8083d73fe98aafc0f6",
	measurementId: "G-9PGSSD2423"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
var auth = getAuth();
var isLoggedIn = false;
let flashcardArray = [];
let count = 0;
let side = "front"; //The side of the card being viewed
let display = document.getElementById("displayFlashcard");
onAuthStateChanged(auth, (user) => {
	if (user) {
	   isLoggedIn = true;
	} else {
	   isLoggedIn = false;
	}
 });
if (display) {	display.innerHTML = "Empty Deck"; }
if (window.location.href.includes("memorize")) { constructDeckList(); }

/**
 * Connect functions to html 
 */ 

 if (document.getElementById("createNewFlashcard")) {
	document.getElementById("createNewFlashcard").addEventListener("click", submitFlashcard);
	document.getElementById("previous").addEventListener("click", getPreviousFlashcard);
	document.getElementById("next").addEventListener("click", getNextFlashcard);
	document.getElementById("flip").addEventListener("click", flipFlashcard);
	document.getElementById("delete").addEventListener("click", deleteFlashcard);
	document.getElementById("exportFlashcards").addEventListener("click", exportFlashcards);
	document.getElementById("getFlashcards").addEventListener("click", getFlashcards);
  }

/**
 * A function for adding new flashcards to the user's flashcard list.
 */
function submitFlashcard() {
	if(flashcardArray.length == 100) {
		document.getElementById("deck-name").value = "Deck length cannot exceed 100!";
		return;
	}
	console.log("flashcard created");
	let card = {front: document.getElementById("card-front").value,
	back: document.getElementById("card-back").value};
	flashcardArray.push(card);
	getNextFlashcard();
		$('#card-front').val(''); 
		$('#card-back').val('');
}

/**
 * A function for retriving the flashcard deck from the database
 */
async function getFlashcards() {
	console.log("getFlashcards called");
	flashcardArray.splice(0, flashcardArray.length);
	count = 0;
	side = "front";
	displayFlashcard.innerHTML = "";
	let name = document.getElementById("Decks").value;

	const q = query(collection(db, "flashcardDecks"));
	const ref = await getDocs(q);
	ref.forEach((a) => {
		if(a.get("name") == name) {
			flashcardArray = a.get("deck");
			console.log("a");
		}
	})
	constructDeckList();
	display.innerHTML = [count + 1, " Front: ", flashcardArray[count].front];
}

/**
 * Exports the current flashcard array to the firebase database.
 */
async function exportFlashcards() {
	console.log("export Called");
	let id = getUID();
	if(id == null) {
		return;
	}
	if(!(flashcardArray.length > 0)) { //Check that the deck has flashcards
		document.getElementById("deck-name").value = "No cards to export!";
		return;
	}
	const deckName = document.getElementById("deck-name").value;
	if(deckName.length > 20) { //Check that the deck name is 20 characters or less
		document.getElementById("deck-name").value = "Deck name must be under 20 characters!";
		return;
	}
	else if(deckName == "") {
		document.getElementById("deck-name").value = "Deck must be named!";
		return;
	}
	try {
		const docRef = await addDoc(collection(db, "flashcardDecks"), {
			name: deckName,
			user: id,
			deck: flashcardArray,
			timestamp: serverTimestamp()
		});
		console.log("Document written with ID: ", docRef.id);
	} 
	catch (error) {
		console.error("Error adding document");
	}
	constructDeckList();
}

/**
 *A function for getting the previous card in the array.
 */
function getPreviousFlashcard() {
	if(count > 0) {
		console.log("getPreviousFlashcard called at array index ", count);
		count = count - 1;
		display.innerHTML = [count + 1 + " Front: " + flashcardArray[count].front];
		side = "front";
	} 
	else if(count == 0) {
		console.log("getPreviousFlashcard called at array index ", count);
		return;
	} 
}

/**
 *A function for getting the next card in the array.
 */
function getNextFlashcard() {
	if(count < flashcardArray.length - 1) {
		console.log("getNextFlashcard called at array index ", count);
		count = count + 1;
		display.innerHTML = [count + 1 + " Front: " + flashcardArray[count].front];
		side = "front";
	}
	else if(count == flashcardArray.length - 1) {
		console.log("getNextFlashcard called at array index ", count);
		return;
	} 
}

/**
 *A function for fliping the currently displayed card.
 */
function flipFlashcard() {
	if(flashcardArray.length == 0) {
		return;
	}
	if(side == "front") {
		display.innerHTML = [count + 1 + " Back: " + flashcardArray[count].back];
		side = "back";
	}
	else if(side == "back") {
		display.innerHTML = [count + 1 + " Front: " + flashcardArray[count].front];
		side = "front";
	}
	else {
		return;
	}
}

/**
 *A function for deleting the currently displayed card.
 */
function deleteFlashcard() {
	if(flashcardArray.length == 0) {
		return;
	}
	else {
		flashcardArray.splice(count, 1);
		if(count > 0) {
			count--;
		}
		if(flashcardArray.length == 0) {
			display.innerHTML = "Empty Deck";
		}
		else if(side == "back") {
			display.innerHTML = [count + 1 + " Back: " + flashcardArray[count].back];
		}
		else if(side == "front") {
			display.innerHTML = [count + 1 + " Front: " + flashcardArray[count].front];
		}
	}
}

/**
 * Get the decks from the database
 */
async function constructDeckList() {
	let fCList = document.getElementById("Decks");
	let id = getUID();
	const q = query(collection(db, "flashcardDecks"));
	const ref = await getDocs(q);
	while(!(fCList.value == "")) {
		fCList.remove(0);
	}
	ref.forEach((a) => {
		if(id == a.get("user")) {
			console.log(a.get("name"));
			fCList.add(new Option(a.get("name"), a.get("name")));
		}
	})
}

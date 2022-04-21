import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp, arrayUnion, arrayRemove, getDoc, ref, getDocs, query } from "firebase/firestore";

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
let flashcardArray = [];
let count = 0;
let side = "front"; //The side of the card being viewed

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
	cardNumber.innerHTML = 0;
	displayFlashcard.innerHTML = "";
	let name = document.getElementById("deck-name").value;

	const q = query(collection(db, "flashcardDecks"));
	const ref = await getDocs(q);
	ref.forEach((a) => {
		if(a.get("name") == name) {
			flashcardArray = a.get("deck");
			console.log("a");
		}
	})
}

/**
 * Exports the current flashcard array to the firebase database.
 */
async function exportFlashcards() {
	console.log("export Called");
	if(!(flashcardArray.length > 0)) {
		document.getElementById("deck-name").value = "No cards to export!";
		return;
	}
	const deckName = document.getElementById("deck-name").value;
	try {
		const docRef = await addDoc(collection(db, "flashcardDecks"), {
			name: deckName,
			deck: flashcardArray,
			timestamp: serverTimestamp()
		});
		console.log("Document written with ID: ", docRef.id);
	} 
	catch (error) {
		console.error("Error adding document");
	}
}

/**
 *A function for getting the previous card in the array.
 */
function getPreviousFlashcard() {
	let display = document.getElementById("displayFlashcard");
	let cardNumber = document.getElementById("cardNumber");
	if(count > 0) {
		console.log("getPreviousFlashcard called at array index ", count);
		count = count - 1;
		cardNumber.innerHTML = count;
		display.innerHTML = ["Front", flashcardArray[count].front];
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
	let display = document.getElementById("displayFlashcard");
	let cardNumber = document.getElementById("cardNumber");
	if(count < flashcardArray.length - 1) {
		console.log("getNextFlashcard called at array index ", count);
		count = count + 1;
		cardNumber.innerHTML = count;
		display.innerHTML = ["Front", flashcardArray[count].front];
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
	let display = document.getElementById("displayFlashcard");
	if(side == "front") {
		display.innerHTML = ["Back", flashcardArray[count].back];
		side = "back";
	}
	else if(side == "back") {
		display.innerHTML = ["Front", flashcardArray[count].front];
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
	let display = document.getElementById("displayFlashcard");
	if(flashcardArray.length == 0) {
		return;
	}
	else {
		flashcardArray.splice(count, 1);
		count = count - 1;
		display.innerHTML = "";
		cardNumber = "";
	}
}

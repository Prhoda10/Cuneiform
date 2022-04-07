const flashcardArray = [];
const flashcardDeckArray = [];
let deckNumber = 0;
let count = 0;
let side = "front";

/**
 * Connect functions to html 
 */ 

 if (document.getElementById("createNewFlashcard")) {
	document.getElementById("createNewFlashcard").addEventListener("click", submitFlashcard);
	document.getElementById("previous").addEventListener("click", getPreviousFlashcard);
	document.getElementById("next").addEventListener("click", getNextFlashcard);
	document.getElementById("flip").addEventListener("click", flipFlashcard);
	document.getElementById("delete").addEventListener("click", deleteFlashcard);
  }

/**
 * A function for adding new flashcards to the user's flashcard list.
 */
function submitFlashcard() {
	console.log("flashcard created")
	let card = {front: document.getElementById("card-front").value, 
	back: document.getElementById("card-back").value};
	flashcardArray.push(card);
	getNextFlashcard();
		$('#card-front').val(''); 
		$('#card-back').val('');
}

/*function getFlashcards() {
	let getDeckNumber = document.getElementById("Decks").value;
	flashcardArray = flashcardDeckArray.slice[getDeckNumber, getDeckNumber + 1];
}*/

/*function exportFlashcards() {
	//JSON.stringify(flashcardArray);
	flashcardDeckArray[deckNumber] = flashcardArray.slice(0);
	deckNumber = deckNumber + 1;
}*/

/**
 *A function for getting the previous card in the array.
 */
function getPreviousFlashcard() {
	let display = document.getElementById("displayFlashcard");
	let cardNumber = document.getElementById("cardNumber");
	if(count > 0) {
		count = count - 1;
		cardNumber.innerHTML = count;
		display.innerHTML = ["Front", flashcardArray[count].front];
		side = "front";
	} 
	else if(count == 0 && side == "back") {
		return;
	} 
	else if(count == 0) {
		cardNumber.innerHTML = count;
		display.innerHTML = ["Front", flashcardArray[count].front];
		side = "front";
	} 
	else {
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
		count = count + 1;
		cardNumber.innerHTML = count;
		display.innerHTML = ["Front", flashcardArray[count].front];
		side = "front";
	}
	else if(count == flashcardArray.length - 1 && side == "back") {
		return;
	} 
	else if(count == flashcardArray.length - 1) {
		cardNumber.innerHTML = count;
		display.innerHTML = ["Front", flashcardArray[count].front];
		side = "front";
	} 
	else {
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
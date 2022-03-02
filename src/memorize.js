const flashcardArray = [];
let count = 0;

/**
 * A function for adding new flashcards to the user's flashcard list.
 */
function submitFlashcard() {
	let list = document.getElementById("flashcardList");
	let newText = document.getElementById("submissionbox").value;
	let newCard = document.createElement("newCard");
	newCard.setAttribute('id', newText);
	newCard.appendChild(document.createTextNode(newText));
	list.appendChild(newCard);
	flashcardArray.push(document.getElementById("submissionbox").value);
}

/*function getFlashcards() {
}*/

/*function exportFlashcards() {
}*/

/**
 *A function for getting the previous card in the array.
 */
function getPreviousFlashcard() {
	let e = document.getElementById("displayFlashcard");
	if(count > 0) {
		count = count - 1;
		e.innerHTML = flashcardArray[count];
	} else if(count == 0) {
		e.innerHTML = flashcardArray[count];
	} else {
		return;
	}
}

function getNextFlashcard() {
	let e = document.getElementById("displayFlashcard");
	if(count < flashcardArray.length - 1) {
		count = count + 1;
		e.innerHTML = flashcardArray[count];
	} else if(count == flashcardArray.length - 1) {
		e.innerHTML = flashcardArray[count];
	} else {
		return;
	}
}
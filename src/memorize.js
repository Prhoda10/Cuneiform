const flashcardArray = [];
let count = 0;
let flashcardIndex = flashcardArray.length;

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

/*function getPreviousFlashcard() {
	if(count > 0) {
		count--;
		document.getElementById("displayFlashcard").innerHTML = String(flashcardArray[count]);
	} 
	} else if(count == 0) {
		document.getElementById("displayFlashcard").innerHTML = String(flashcardArray[count]);
	} else {
		return;
}

function getNextFlashcard() {
	if(count < flashcardArray.length) {
		count++;
		document.getElementById("displayFlashcard").innerHTML = String(flashcardArray[count]);
	} 
	} else if(count == flashcardArray.length) {
		document.getElementById("displayFlashcard").innerHTML = String(flashcardArray[count]);
	} else {
		return;
}*/
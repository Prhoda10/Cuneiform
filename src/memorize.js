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

function getPreviousFlashcard() {
	let e = document.getElementById("displayFlashcard");
	e.innerHTML = flashcardArray;
	/*if(count > 0) {
		count--;
		document.write(e.innerHTML = flashcardArray[count]);
	} 
	} else if(count == 0) {
		document.write(e.innerHTML = flashcardArray[count]);
	} else {
		return;*/
}

function getNextFlashcard() {
	let e = document.getElementById("displayFlashcard");
	e.innerHTML = flashcardArray;
	/*if(count < flashcardArray.length) {
		count++;
		document.write(e.innerHTML = flashcardArray[count]);
	} 
	} else if(count == flashcardArray.length) {
		document.write(e.innerHTML = flashcardArray[count]);
	} else {
		return;*/
}
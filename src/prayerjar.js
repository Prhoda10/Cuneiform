import { getDatabase, ref as dbref, set, child, get, onValue } from "firebase/database";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { login } from '../src/account.js';

//Auth
var auth = getAuth();
var isLoggedIn;

if (window.location.href.includes("prayer-jar")) {
	onAuthStateChanged(auth, (user) => {
		if (user) {
			isLoggedIn = true;
			loadGroups();
		} else {
			isLoggedIn = false;
			login();
		}
	});
}

async function loadGroups() {
	const db = getDatabase();
	const groupRef = dbref(db, 'users/'+auth.currentUser.uid+'/groups');
  	onValue(groupRef, (snapshot) => {
    	snapshot.forEach((childSnapshot) => {
			printGroup(childSnapshot.val());
		  });
  });
}

function printGroup(item, val) {
	let button = document.createElement('Button');
	button.innerText = ""+item.GroupID;
	button.addEventListener('click', () => {
		loadPrayers(item.GroupID);
	});
	document.getElementById("groupChart").appendChild(button);
}

function loadPrayers() {
	return;
}

// Saves a new message to Cloud Firestore.
async function saveMessage(msg, grpID) {
	// Add a new message entry to the Firebase database.
	try {
		const db = getDatabase();
		set(dbref(db, 'groups/'+grpID+"/prayers"), {
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
	document.getElementById("make-group").addEventListener("click", () => {
		document.getElementById('groupForm').style.display = "block";
	});
	document.getElementsByClassName("join-submit")[0].addEventListener("click", () => {
		let groupID = document.getElementById("groupIDcode").value;
		joinGroup(groupID);
	});
	document.getElementById("createGButton").addEventListener("click", () => {
		console.log("createGButton pressed");
		let name = document.getElementById("newGroupName").value;
		createGroup(name);
		document.getElementById('groupForm').style.display = "none";
	});
	document.getElementById("cancelButton").addEventListener("click", () => {
		document.getElementById('groupForm').style.display = "none";
	});
	document.getElementsByClassName("openButton")[0].addEventListener("click", () => {
		document.getElementById("popupForm").style.display = "block";
	});
	document.getElementsByClassName("btn cancel")[0].addEventListener("click", () => {
		document.getElementById("popupForm").style.display = "none";
	});
}

import { getUID } from '../src/account.js';
//Adds a group to the database with the given name, creates a unique group id for the group, adds caller as group leader, adds caller to group.
function createGroup(name) {
	console.log("createGroup called");
	let members = [getUID()];
	let id = generateID(6);
	const db = getDatabase();
	set(dbref(db, 'groups/'+id), {
		Name: name,
		Owner: getUID(),
		Members: members,
		ID: id
	});
	set(dbref(db, 'users/'+getUID()+'/groups/' + id), {
		GroupID: id
	});
}

async function joinGroup(ID) {
	console.log("joinGroup Called");
	const db = getDatabase();
	var uid = getUID();
	var newMembers = [uid];
	console.log(newMembers);
	var owner;
	var name;
	set(dbref(db, 'users/'+ uid +'/groups/'+ID), { //Should we check if already in this group first?
		GroupID: ID
	});
	console.log("joinGroup called");
	await get(child(dbref(db), 'groups/'+ID)).then((snapshot) => { //Just to read the Members array for ID's group
		if (snapshot.exists()) {
			console.log("snapshot Exists");
			console.log(snapshot.val());
			owner = snapshot.val().Owner;
			name = snapshot.val().Name;
			if (!snapshot.val().Members.includes(newMembers[0])) {
				newMembers = newMembers.concat(snapshot.val().Members);
			} else {
				newMembers = snapshot.val().Members;
			}
		}
	}).catch((error) => {
		console.log("snapshot Error");
		console.error(error);
	});
	console.log(newMembers);

	set(dbref(db, 'groups/'+ID), {
		Name: name,
		Owner: owner,
		Members: newMembers,
		ID: ID
	});
	
}

export function generateID(count){
	var chars = 'acdefhiklmnoqrstuvwxyz0123456789'.split('');
	var result = '';
	for (var i = 0; i < count; i++) {
		var x = Math.floor(Math.random() * chars.length);
		result += chars[x];
	}
	return result;
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
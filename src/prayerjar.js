import { getDatabase, ref as dbref, set, child, get, onValue } from "firebase/database";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { login } from '../src/account.js';

//Auth
var auth = getAuth();
var isLoggedIn;

onAuthStateChanged(auth, (user) => {
	if (user) {
		isLoggedIn = true;
		if (window.location.href.includes("prayer-jar"))
			loadGroups();
	} else {
		isLoggedIn = false;
		if (window.location.href.includes("prayer-jar"))
			login();
	}
});

async function loadGroups() {
	const db = getDatabase();
	const groupRef = dbref(db, 'users/'+auth.currentUser.uid+'/groups');
  	onValue(groupRef, (snapshot) => {
		const newDiv = document.createElement("div");
		const newContent = document.createTextNode("My Groups:");
		newDiv.appendChild(newContent);
		document.getElementById("groupChart").appendChild(newDiv);
    	snapshot.forEach((childSnapshot) => {
			printGroup(childSnapshot.val());
		  });
  });
}

function printGroup(item, val) {
	let button = document.createElement('Button');
	button.innerText = ""+item.Name;
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
	document.getElementById("secondaryJoin").addEventListener("click", () => {
		let groupID = document.getElementById("groupIDcode").value;
		joinGroup(groupID);
		document.getElementById('popupForm').style.display = "none";
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
	$("#groupChart").html(""); //make sure groups don't appear twice
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
		GroupID: id,
		Name: name
	});
}

async function joinGroup(ID) {
	console.log(ID);
	const db = getDatabase();
	var uid = getUID();
	var newMembers = [uid];
	const group = await getGroupObject(ID);
	console.log("joinGroup called");
	if (group) {
		console.log(group.Members);
		if (!group.Members.includes(newMembers[0])) {
			newMembers = newMembers.concat(group.Members);
			console.log(newMembers);
		} else {
			newMembers = group.Members;
		}
		addUserToGroup(db, group.Name, group.Owner, newMembers, ID);
	} else { console.log("null group"); }	
	setGroupToUser(db, uid, ID, group.Name);
}

function addUserToGroup(db,name, owner, newMembers, ID) {
	set(dbref(db, 'groups/'+ID), {
		Name: name,
		Owner: owner,
		Members: newMembers,
		ID: ID
	});
}

async function getGroupObject(groupId) {
	const dbRef = dbref(getDatabase());
	const snapshot = await get(child(dbRef, 'groups/'+groupId));
	if (snapshot.exists()) {
		console.log(snapshot.val());
		return snapshot.val();
	} else {
		console.log("No data available");
		return null;
	}
}

function setGroupToUser(db, uid, groupId, name) {
	set(dbref(db, 'users/'+ uid +'/groups/'+groupId), { //Should we check if already in this group first?
		GroupID: groupId,
		Name: name
	});
	console.log("User set to group");
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

	if (checkPrayer(prayer, unacceptableWords)) {
		return;
	} else {
		window.alert("Prayer Submitted!");
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
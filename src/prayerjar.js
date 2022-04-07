
const unacceptableWords = []; //An array of words banned from prayer requests.

/*if (document.getElementsByClassName("get-prayer")) {
	document.getElementsByClassName("get-prayer").addEventListener("click", removePrayer);
  }


if (document.getElementsByClassName("submit-prayer")) {
	document.getElementsByClassName("submit-prayer").addEventListener("click", submitPrayer);
  }
  */


/**
* A function for submiting prayer requests.
*/
function submitPrayer() {
	let list = document.getElementById("prayerList");
	let prayer = document.getElementById("submissionBox").value;
	let li = document.createElement("li");
	if(checkPrayer(prayer, unacceptableWords)) {
		return;
	} else {
		li.setAttribute('id', prayer);
		li.appendChild(document.createTextNode(prayer));
		list.appendChild(li);
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
	for(let i = 0; i < words.length; i++) {
		if(x.includes(words[i])) {
			document.getElementById("invalidPrayerInput").innerHTML = "Prayer contains unaccepable language";
			return true;
		}
	}
	return false;
}

import { getFirestore, collection } from 'firebase/firestore';
const firestore = getFirestore();
const tasksDOM = document.getElementById("tasks");
const taskInputDOM = document.getElementById("taskTitle");


	  // utility functions
	  function cleanData(snapshots) {
		let data = [];
		snapshots.forEach(function(doc) {
		  data.push({ id: doc.id, ...doc.data() });
		})
		return data;
	  }
  
	  // form functions
	 
	  document.getElementById("submit-button").addEventListener("submit", function handleCreate(event) {
		event.preventDefault();
		let task = {
		  name: taskInputDOM.value,
		  status: 'incomplete'
		}
		return collection('tasks').add(task)
		.then(ref => {
		  task.id = ref.id;
		  taskInputDOM.value = '';
		  return createTask(task);
		})
	  });

	  function handleStatusUpdate(task) {
		let updatedTask = {
		  name: task.name,
		  status: 'complete'
		}
		return collection('tasks').doc(task.id).update(updatedTask)
		.then(ref => {
		  document.getElementById(task.id).remove();
		  return createTask(updatedTask);
		})
	  }
  
	  function handleDelete(id) {
		return collection('tasks').doc(id).delete()
		.then(ref => document.getElementById(id).remove())
	  }
  
	  // dom functions
	  function createTask(task) {
		const elem = document.createElement('div');
		elem.setAttribute('id', task.id);
		elem.setAttribute('class', 'card card-body p-2 col-4 row m-0 flex-row d-flex justify-content-between align-items-center');
		let taskElem;
  
		if (task.status === 'incomplete') { 
		  taskElem = document.createElement('p');
		  taskElem.setAttribute('class', 'm-0 col-7 p-0');
		  taskElem.innerText = task.name;
		} else {
		  taskElem = document.createElement('s');
		  taskElem.setAttribute('class', 'm-0 col-7 p-0');
		  taskElem.innerText = task.name;
		}
		elem.append(taskElem);
  
		if (task.status === 'incomplete') {
		  const updateBtn = document.createElement('button');
		  updateBtn.setAttribute('class', 'btn btn-success col-2 text-white mr-1');
		  updateBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';
		  updateBtn.addEventListener('click', function() {
			return handleStatusUpdate(task)
		  })
		  elem.append(updateBtn);
		}
  
		const deleteBtn = document.createElement('button');
		deleteBtn.setAttribute('class', 'btn btn-danger col-2 text-white');
		deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
		deleteBtn.addEventListener('click', function() {
		  return handleDelete(task.id)
		})
		elem.append(deleteBtn);
  
		tasksDOM.append(elem);
	  }
  
	  // firebase functions
	  function fetchTasks() {
		return collection('tasks').get()
		.then(snapshots => cleanData(snapshots))
		.then(tasks => tasks.map(task => createTask(task)))
	  };
  
	  fetchTasks();
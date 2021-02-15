// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// go to firebase, and create a new web app, and get the following details
var firebaseConfig = {
  apiKey: "your apikey",
  authDomain: "your authDomain",
  databaseURL: "your databaseURL",
  projectId: "your projectId",
  storageBucket: "your storageBucket",
  messagingSenderId: "your messagingSenderId",
  appId: "your appId",
  measurementId: "your measurementId"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

if (!localStorage.getItem('name')) {
  name = prompt('What is your name?')
  localStorage.setItem('name',name)
}else {
  name = localStorage.getItem('name')
}

document.querySelector('#name').innerText = name

document.querySelector('#change-name').addEventListener('click',() => {
  name = prompt('What is your name?')
  localStorage.setItem('name',name)
  document.querySelector('#name').innerText = name
})


// db.collection('messages')
//   .add({
//     name: 'John Doe',
//     message: 'Hello from world!'
//   })
//   .then(function (docRef) {
//     console.log('Document written with id: ${docRef.id}');
//   })
//   .catch(function (error) {
//     console.log('Error adding document: ${error}');
//   });


// form event listener
document.querySelector('#message-form').addEventListener('submit', e => {
  e.preventDefault();

  // get form values
  let message = document.querySelector('#message-input').value 

  // saving to database
  // Adding a timestamp to load newest messages first
  db.collection('messages')
  .add({
    name: name,
    message: message,
    date: firebase.firestore.Timestamp.fromMillis(Date.now())
  })
  .then((docRef) => {
    console.log(`Document written with ID: ${docRef.id}`);
    document.querySelector('#message-form').reset()
  })
  .catch((error) => {
    console.error(`Error adding document: ${error}`);
  });
})

// real time listener
// The real-time listener that Firestore provides is one of its best features. 
// If data changes, the listener knows and refreshes your data on the client. 
// It then updates the DOM without a page refresh. This is why the messages show up in real-time!
// order the messages by the time it was created.
db.collection('messages')
.orderBy('date','asc')
.onSnapshot(snapshot => {
  document.querySelector('#messages').innerHTML = ''
  snapshot.forEach(doc => {
    let message = document.createElement('div')
    message.innerHTML = `
    <p class="name">${doc.data().name}</p>
    <p>${doc.data().message}</p>
    `
    document.querySelector('#messages').prepend(message)
  })
})

// Delete all documents at once
document.querySelector('#clear').addEventListener('click', ()=>{
  db.collection('messages')
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      db.collection('messages').doc(doc.id).delete()
      .then(() => {
        console.log('Document successfully deleted');
      })
      .catch((error) => {
        console.error('Error deleting document', error);
      })
    })
  })
  .catch(error => {
    console.log('Error getting document: ', error)
  });
})


// Delete one particular document
function deleteid(elem) {
  var id = $(elem).attr("id");

  console.log(id);

  db.collection('messages').doc(id)
  .delete()
  .then(() => {
    console.log('Document successfully deleted',id);
  })
  .catch((error) => {
    console.error('Error deleting document', error);
  })

}

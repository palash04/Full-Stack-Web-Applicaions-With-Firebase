// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get element that is the input we will click to upload the images
const uploadButton = document.querySelector('#upload-button');

// Get element that shows the progress of the image uploading action
const progressBar = document.querySelector('progress');

// image file is global so we can access it after it uploads
let imagefile

// Event listener for if upload image button is clicked and a file has been selected
uploadButton.addEventListener('change', (event) => {

  // Access the chosen file through the event
  let file = event.target.files[0];
  
  // Define a var just for the name of the file
  let name = event.target.files[0].name;

  // Create a storage reference to the database using the name of the chosen file
  let storageRef = firebase.storage().ref(name)

  // Attach the put method to the storageRef 
  storageRef.put(file).on("state_changed",
    snapshot => {
      let percentage = Number(snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0)
      progressBar.value = percentage
    },
    error => {
      console.log('error', error.message)
    },
    () => {

      // Once upload is complete make a second request to get the download URL
      storageRef.put(file).snapshot.ref.getDownloadURL()
        .then((url) => {
          // We now have the uploaded url 
          console.log(url);

          // Every time we upload a image we also need to add a reference to the database
          firebase.firestore().collection('images').add({
            url: url
          })
          .then(success => console.log(success))
          .catch(error => console.log(error))

          // reset the progress bar to zero percent after one second
          setTimeout(() => {
            progressBar.removeAttribute('value')
          }, 1000)
        })
    })
})


// listen to database in the images collection. Loop through returned data to create image elements
firebase.firestore().collection('images').onSnapshot(snapshot => {
  document.querySelector('#images').innerHTML = ""
  snapshot.forEach(each => {
    let url = doc.data().url;
    let id = doc.id;
    let photo = document.createElement('div')
    photo.innerHTML = `
      <img src="${url}"/>
      <button id="${id}" onclick="deleteid(this)">Remove</button>
    `
    document.querySelector('#images').append(photo)
  })
})

// Eventlistener for removing all images button
document.querySelector('#clear').addEventListener('click', ()=> {
  // step 1
  firebase.firestore().collection("images")
  .get()
  // step 2 (if success)
  .then(function(snapshot) {
    // step 3
    snapshot.forEach(function(doc) {
      firebase.firestore().collection("images").doc(doc.id).delete()
      // step 4 (if success)
      .then(function() {
        console.log("Document successfully deleted!");
      })
      // step 4 (if error)
      .catch(function(error) {
        console.log("Error having document: ", error);
      });
    });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });
});

// Delete one particular document
function deleteid(elem) {
  let id = $(elem).attr("id");
  console.log(id);
  
  // Grab the data stored in firestore under this id
  // let docRef1 = firebase.firestore().collection('images').doc(id);
  // docRef1.get().then(doc =>  {
  //   let url = doc.data().url;
  //   console.log(url);
  // }).catch(error => {
  //   console.log(error);
  // });

  firebase.firestore().collection('images').doc(id)
    .delete()
    .then(() => {
      console.log('Image successfully deleted',id);
    })
    .catch((error) => {
      console.error('Error deleting document', error);
    });
}


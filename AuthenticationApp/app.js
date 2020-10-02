// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC48wRD_QMwcnECHXqIwOf_MYyWStCuqGM",
  authDomain: "authentication-app-121.firebaseapp.com",
  databaseURL: "https://authentication-app-121.firebaseio.com",
  projectId: "authentication-app-121",
  storageBucket: "authentication-app-121.appspot.com",
  messagingSenderId: "144170937443",
  appId: "1:144170937443:web:f6b1cfa985203ef25fdc56"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// reference to auth method of firebase
const auth = firebase.auth();

// declare uid globally
let uid;

// Access the modal element
const modal = document.getElementById('modal');

// Access the element that closes the modal
const close = document.getElementById('close');

// Access elements that need to be hidden or show based on auth state
const hideWhenSignedIn = document.querySelectorAll('.hide-when-signed-in')
const hideWhenSignedOut = document.querySelectorAll('.hide-when-signed-out')

// Access the forms for email and password authentication
const createUserForm = document.getElementById('create-user-form');
const signInForm = document.getElementById('sign-in-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

// when the user clicks the (x) button close the modal
close.addEventListener('click', () => {
  modal.style.display = 'none';
});

// When the user clicks anywhere outside the modal close it.
window.addEventListener('click', event => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});


// Invoked at the start of auth functions in order to hide everything before selectively showing the correct form
hideAuthElements = () => {
  clearMessage()
  loading('hide')
  createUserForm.classList.add('hide')
  signInForm.classList.add('hide')
  forgotPasswordForm.classList.add('hide')
}

// Invoked when user wants to create a new user account
showCreateUserForm = () => {
  hideAuthElements();
  modal.style.display = 'block';
  createUserForm.classList.remove('hide');
  //signInDialog.classList.remove('hide')
  //haveOrNeedAccountDialog.classList.remove('hide')
}

// Invoked when user wants to sign in
showSignInForm = () => {
  hideAuthElements();
  modal.style.display = 'block';
  signInForm.classList.remove('hide');
  // createUserDialog.classList.remove('hide')
  //haveOrNeedAccountDialog.classList.remove('hide')
}

// Invoked when a user wants reset their password
showForgotPasswordForm = () => {
    hideAuthElements();
    modal.style.display = 'block'
    forgotPasswordForm.classList.remove('hide');
}

// Access auth elements to listen for auth actions
const authAction = document.querySelectorAll('.auth');

// Loop through elements and use the associated auth attribute to determine what action to take when clicked
authAction.forEach(eachItem => {
  eachItem.addEventListener('click', event => {
    let chosen = event.target.getAttribute('auth')
    if (chosen == 'show-create-user-form') {
      console.log('Sign up clicked');
      showCreateUserForm();
    }else if (chosen == 'show-sign-in-form') {
      console.log('Sign in clicked');
      showSignInForm();
    }else if (chosen == 'show-forgot-password-form') {
      console.log('Forgot Password clicked');
      showForgotPasswordForm();
    }else if (chosen === `sign-out`){
      signOut();
    }
  })
})

// Create user form submit event
createUserForm.addEventListener(`submit`, event => {
    event.preventDefault();
    loading('show');
    // Grab values from form
    const displayName = document.getElementById(`create-user-display-name`).value;
    const email = document.getElementById(`create-user-email`).value;
    const password = document.getElementById(`create-user-password`).value;

    // send values to firebase
    auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      auth.currentUser.updateProfile({
        displayName: displayName
      })
      createUserForm.reset();
      hideAuthElements();
      console.log(displayName);
    })
    .catch(error => {
      loading('hide');
      console.log(error.message);
      displayMessage('error', error.message);
    });
});

// Invoked when user wants to sign out
signOut = () => {
    auth.signOut();
    hideAuthElements();
};

// Sign in form submit event
signInForm.addEventListener(`submit`, event => {
  event.preventDefault();
  loading('show');
  // Grab values from form
  const email = document.getElementById(`sign-in-email`).value;
  const password = document.getElementById(`sign-in-password`).value;

  // send values to firebase
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
    signInForm.reset()
    hideAuthElements()
    })
    .catch(error => {
    loading('hide');
    console.log(error.message)
    displayMessage('error', error.message);
    })
});

auth.onAuthStateChanged(user => {
  if (user) {
    // Everything inside here happens if user is signed in 
    console.log(user);
    // this assigns a value to the variable uid
    uid = user.uid;
    modal.style.display = 'none';

    hideWhenSignedIn.forEach(eachItem => {
      eachItem.classList.add('hide')
    });

    hideWhenSignedOut.forEach(eachItem => {
      eachItem.classList.remove('hide')
    });

    // Greet the user with a message and make it personal by using their name
    if (user.displayName) {
      console.log('signed in');
      console.log(user.displayName);
      document.getElementById('display-name-header').textContent = `Hello, ${user.displayName}`
    }

  } else {
    // Everything inside here happens if user is not signed in 
    console.log('not signed in');

    // Hides or shows elements depending on if user is signed out
    hideWhenSignedIn.forEach(eachItem => {
      eachItem.classList.remove('hide')
    });
    hideWhenSignedOut.forEach(eachItem => {
      eachItem.classList.add('hide')
    });
  }
})

// Forgot password form submit event
forgotPasswordForm.addEventListener(`submit`, event => {
  event.preventDefault();
  loading('show')
  // Grab value from form
  var emailAddress = document.getElementById(`forgot-password-email`).value;

  firebase.auth().sendPasswordResetEmail(emailAddress)
    .then(() => {
    forgotPasswordForm.reset()
    console.log('Message sent. Please Check your email')
    displayMessage('success', 'Message sent. Please check your email.');
    })
    .catch(error => {
    loading('hide');
    console.log(error.message)
    displayMessage('error', error.message);
    })
});


// Access the message HTML element
const authMessage = document.getElementById('message');

// Error and message handling
displayMessage = (type, message) => {
    if (type === 'error'){
        authMessage.style.borderColor = 'red'
        authMessage.style.color = 'red'
        authMessage.style.display = 'block'
    } else if (type === 'success'){
        authMessage.style.borderColor = 'green'
        authMessage.style.color = 'green'
        authMessage.style.display = 'block'
    }

    authMessage.innerHTML = message
}

messageTimeout = setTimeout(() => {
        authMessage.innerHTML = ''
        authMessage.style.display = 'none'
}, 7000)

clearMessage = () => {
  clearTimeout(messageTimeout)
  authMessage.innerHTML = ''
  authMessage.style.display = 'none'
}

// Function to hide and show the loading visual cue
loading = (action) => {
  if (action === 'show'){
      document.getElementById('loading-outer-container').style.display = 'block'
  } else if (action === 'hide'){
      document.getElementById('loading-outer-container').style.display = 'none'
  } else {
      console.log('loading error')   
  }
}








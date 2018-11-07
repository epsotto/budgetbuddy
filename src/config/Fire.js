import firebase from 'firebase'

// Initialize Firebase
const config = {
	apiKey: 'AIzaSyCnvfU79IK-cgW2OtffWcvd6xdcWaxNUf4',
	authDomain: 'budget-buddy-80b3b.firebaseapp.com',
	databaseURL: 'https://budget-buddy-80b3b.firebaseio.com',
	projectId: 'budget-buddy-80b3b',
	storageBucket: 'budget-buddy-80b3b.appspot.com',
	messagingSenderId: '191434933484',
}

const fire = firebase.initializeApp(config)
export default fire

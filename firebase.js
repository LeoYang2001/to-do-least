import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-nwqpWVzAJmQ6NxAoeB6Z18LM4Ihd6jE",
    authDomain: "todo-list-5703b.firebaseapp.com",
    projectId: "todo-list-5703b",
    storageBucket: "todo-list-5703b.appspot.com",
    messagingSenderId: "901469748084",
    appId: "1:901469748084:web:5ee24272ff52f50547ca21"
  };
const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export {auth, db}
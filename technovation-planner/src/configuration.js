// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, getDoc, getDocs, doc, query, orderBy } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAx8LwtLKNzfrMtJ4BtaXWGoMTnQk3i7Vs",
  authDomain: "technovation-planner.firebaseapp.com",
  databaseURL: "https://technovation-planner-default-rtdb.firebaseio.com",
  projectId: "technovation-planner",
  storageBucket: "technovation-planner.firebasestorage.app",
  messagingSenderId: "703990993221",
  appId: "1:703990993221:web:01704b7fff6fabfb4b2e2c",
  measurementId: "G-TFZHKP8Z6E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db, collection, doc, addDoc, setDoc, getDoc, getDocs, createUserWithEmailAndPassword, query, orderBy };


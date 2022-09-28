import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCyq9R2_4tn6hdPDRh8hHChP8QZJ1Ar5wY",
    authDomain: "rdproject-e560d.firebaseapp.com",
    projectId: "rdproject-e560d",
    storageBucket: "rdproject-e560d.appspot.com",
    messagingSenderId: "731618045964",
    appId: "1:731618045964:web:ebe6b3c0d7c22e700dfe29"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const Gitprovider = new GithubAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
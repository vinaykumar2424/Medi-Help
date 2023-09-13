// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAZyAdDT0vy_pMKeLT3CsOeiNyxZju-vRo",
    authDomain: "medihelp-860cb.firebaseapp.com",
    projectId: "medihelp-860cb",
    storageBucket: "medihelp-860cb.appspot.com",
    messagingSenderId: "162941096942",
    appId: "1:162941096942:web:3dcb9343fca5633baaf4ff",
    measurementId: "G-BV1827L1E9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
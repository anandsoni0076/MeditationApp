
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6nmk44lBn9SViGVZaPyPr6T3N84Mcr5E",
  authDomain: "acex-820a5.firebaseapp.com",
  databaseURL: "https://acex-820a5-default-rtdb.firebaseio.com",
  projectId: "acex-820a5",
  storageBucket: "acex-820a5.appspot.com",
  messagingSenderId: "93440108718",
  appId: "1:93440108718:web:49ac7f4787f5c30b7f653f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {auth};
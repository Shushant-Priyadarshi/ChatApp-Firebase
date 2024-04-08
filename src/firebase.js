
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDVrUzONEEHl5m6Tx_0k-VkmIVuZrly-CQ",
  authDomain: "sushichatapp.firebaseapp.com",
  projectId: "sushichatapp",
  storageBucket: "sushichatapp.appspot.com",
  messagingSenderId: "994483375157",
  appId: "1:994483375157:web:1db63fe4c1248f6983357c"
};


export const app = initializeApp(firebaseConfig);
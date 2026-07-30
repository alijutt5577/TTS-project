import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5msbe353ZIXKDnCEh_nC81EeOfaVmvuo",
  authDomain: "todaytrendshop-fe9bf.firebaseapp.com",
  projectId: "todaytrendshop-fe9bf",
  storageBucket: "todaytrendshop-fe9bf.firebasestorage.app",
  messagingSenderId: "979493305749",
  appId: "1:979493305749:web:c0100c0dff59f237528a9c",
  measurementId: "G-MGJ08RWG8V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
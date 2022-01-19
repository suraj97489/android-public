import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtn1hA7YrPTBOQd7U74sJEU56JZeTd_XM",
  authDomain: "sk-production-d85c3.firebaseapp.com",
  databaseURL:
    "https://sk-production-d85c3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sk-production-d85c3",
  storageBucket: "sk-production-d85c3.appspot.com",
  messagingSenderId: "1031556190722",
  appId: "1:1031556190722:web:0ed6c504e1169143f14d1b",
  measurementId: "G-H94S3YC56G",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, storage, auth };

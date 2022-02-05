import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID,
  // measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  apiKey: "AIzaSyAUv7Pq-QMdrGKXR7UCzytHbYw2AHxHkkk",
  authDomain: "salonkattanew.firebaseapp.com",
  projectId: "salonkattanew",
  storageBucket: "salonkattanew.appspot.com",
  messagingSenderId: "786462931290",
  appId: "1:786462931290:web:e29160555434d424ec5b63",
  measurementId: "G-MRCG06HR18",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, storage, auth };

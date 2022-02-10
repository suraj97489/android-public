import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from "@env";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
  // apiKey: "AIzaSyAUv7Pq-QMdrGKXR7UCzytHbYw2AHxHkkk",
  // authDomain: "salonkattanew.firebaseapp.com",
  // projectId: "salonkattanew",
  // storageBucket: "salonkattanew.appspot.com",
  // messagingSenderId: "786462931290",
  // appId: "1:786462931290:web:e29160555434d424ec5b63",
  // measurementId: "G-MRCG06HR18",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, storage, auth };

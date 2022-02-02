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
  apiKey: "AIzaSyCDABZeTU2k7bzLIk14gDJkIxWLatN_d-8",
  authDomain: "salonkatta-bff6d.firebaseapp.com",
  projectId: "salonkatta-bff6d",
  storageBucket: "salonkatta-bff6d.appspot.com",
  messagingSenderId: "471341648576",
  appId: "1:471341648576:web:2910cbda481ee746fdfb25",
  measurementId: "G-5BR8J6NF36",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, storage, auth };

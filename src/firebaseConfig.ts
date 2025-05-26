import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection} from 'firebase/firestore'


// Firebase Config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET, 
    messagingSenderId: import.meta.env.VITE_MESSAGESENDERID,
    appId: import.meta.env.VITE_APPID
};

// Initialize Firebase
const appinit = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(appinit);
const auth = getAuth()

// Collection reference
const colRef = collection(db, "users");
const transRef = collection(db, "messages");
const orgRef = collection(db, "organizations");
const payRef = collection(db, "payments");

export { appinit, auth, db, colRef, transRef, payRef, orgRef };
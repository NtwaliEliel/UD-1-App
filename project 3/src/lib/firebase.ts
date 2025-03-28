import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACIrsy9XqdkhusBReshtJtg-fDPAMj8hQ",
  authDomain: "ud-1-59d56.firebaseapp.com",
  projectId: "ud-1-59d56",
  storageBucket: "ud-1-59d56.firebasestorage.app",
  messagingSenderId: "495061446140",
  appId: "1:495061446140:web:b4acdf49fb56d4e2a99679",
  measurementId: "G-XJ7FKGRDTG"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
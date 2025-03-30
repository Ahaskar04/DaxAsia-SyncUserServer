import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCMyG-NlfTDUIe18uI6W0u-oVk2I5dyc90",
  authDomain: "daxasia.firebaseapp.com",
  projectId: "daxasia",
  storageBucket: "daxasia.firebasestorage.app",
  messagingSenderId: "4237412426",
  appId: "1:4237412426:web:25ce370302432f1ec3beb3",
  measurementId: "G-7B1SZE6C72"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// export const analytics = getAnalytics(app);

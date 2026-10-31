import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBEAhl6ISSiMlq9rcTa3fzghqR9OTMVpGI',
  authDomain: 'rishirides-888b5.firebaseapp.com',
  projectId: 'rishirides-888b5',
  storageBucket: 'rishirides-888b5.firebasestorage.app',
  messagingSenderId: '250905007844',
  appId: '1:250905007844:web:84f68b00087d0cb8cffef1',
  measurementId: 'G-L3XS7MTT9L',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;

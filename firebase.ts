import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCs5zW8noOygdIyQpBgcdiO4u7KXKxeE54",
  authDomain: "monetiza-ia-v2.firebaseapp.com",
  projectId: "monetiza-ia-v2",
  storageBucket: "monetiza-ia-v2.firebasestorage.app",
  messagingSenderId: "815380813857",
  appId: "1:815380813857:web:1027af3a8b60db228cab60",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

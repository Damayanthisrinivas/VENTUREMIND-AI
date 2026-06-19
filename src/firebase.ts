import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsZXPezMpTgBXfFKxfhX6bCTc2M_SJ60c",
  authDomain: "gen-lang-client-0261181850.firebaseapp.com",
  projectId: "gen-lang-client-0261181850",
  storageBucket: "gen-lang-client-0261181850.firebasestorage.app",
  messagingSenderId: "960206048715",
  appId: "1:960206048715:web:187cff33d5b8f79d94ba4e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

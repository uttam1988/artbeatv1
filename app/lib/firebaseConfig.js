import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBXt-mMV1QO3PQuWHt0F8wVnvdWROtmlAE",
	authDomain: "artbeatdb-2f566.firebaseapp.com",
	databaseURL: "https://artbeatdb-2f566-default-rtdb.firebaseio.com",
	projectId: "artbeatdb-2f566",
	storageBucket: "artbeatdb-2f566.firebasestorage.app",
	messagingSenderId: "322785708652",
	appId: "1:322785708652:web:6280e2c9e28d5f31fde649",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

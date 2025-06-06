import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDREoEi2SvvLJbhWmPLX1NCx7AFVd-etyU",
  authDomain: "kleinanzeigen-62bc9.firebaseapp.com",
  projectId: "kleinanzeigen-62bc9",
  storageBucket: "kleinanzeigen-62bc9.firebasestorage.app",
  messagingSenderId: "97228552209",
  appId: "1:97228552209:web:28ca2e1a88859f3cf399b0",
  measurementId: "G-K4PLL0TJHN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixCreatedAt() {
  const adsCol = collection(db, "ads");
  const snap = await getDocs(adsCol);

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const createdAt = data.createdAt;

    // Prüfe, ob createdAt KEIN Firestore Timestamp ist
    if (!createdAt || typeof createdAt.toDate !== "function") {
      let newTimestamp;
      try {
        // Falls es ein JS-Date-Objekt ist (als String gespeichert)
        newTimestamp = Timestamp.fromDate(new Date(createdAt));
      } catch {
        // Fallback: Jetzt-Zeit
        newTimestamp = Timestamp.now();
      }
      await updateDoc(doc(db, "ads", docSnap.id), { createdAt: newTimestamp });
      console.log(`Updated createdAt for ad ${docSnap.id}`);
    }
  }
  console.log("Fertig!");
}

fixCreatedAt();
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDREoEi2SVvLJbNwmPLXlNCx7AFVd-etyU",
  authDomain: "kleinanzeigen-62bc9.firebaseapp.com",
  projectId: "kleinanzeigen-62bc9",
  storageBucket: "kleinanzeigen-62bc9.appspot.com",
  messagingSenderId: "972285552209",
  appId: "1:972285552209:web:28ca2e1a88859f3cf399b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixImageUrls() {
  const adsCol = collection(db, "ads");
  const snapshot = await getDocs(adsCol);

  for (const adDoc of snapshot.docs) {
    const ad = adDoc.data();
    if (Array.isArray(ad.images)) {
      const newImages = ad.images.map((url) =>
        url.replace(
          "kleinanzeigen-62bc9.appspot.com",
          "kleinanzeigen-62bc9.firebasestorage.app"
        )
      );
      if (JSON.stringify(newImages) !== JSON.stringify(ad.images)) {
        await updateDoc(doc(db, "ads", adDoc.id), { images: newImages });
        console.log(`Updated ad ${adDoc.id}`);
      }
    }
  }
  console.log("Fertig!");
}

fixImageUrls().catch(console.error);

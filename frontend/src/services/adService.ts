import { db } from '@/config/firebase';
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Ad {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[]; // URLs
  userId: string;
  createdAt: Date | Timestamp;
  condition: string;
}

const storage = getStorage();

export const adService = {
  async uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, `ads/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  async createAd(ad: Omit<Ad, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'ads'), {
      ...ad,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async getAdById(id: string): Promise<Ad | null> {
    const docRef = doc(db, 'ads', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    console.log("Firestore-Daten für Anzeige:", data);
    return {
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
    } as Ad;
  },

  async getAdsByUser(userId: string): Promise<Ad[]> {
    const q = query(collection(db, 'ads'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      } as Ad;
    });
  },

  async getAllAds(): Promise<Ad[]> {
    const snap = await getDocs(collection(db, 'ads'));
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      } as Ad;
    });
  },

  async updateAd(id: string, data: Partial<Ad>) {
    const docRef = doc(db, 'ads', id);
    await updateDoc(docRef, data);
  },

  async deleteAd(id: string) {
    const docRef = doc(db, 'ads', id);
    await deleteDoc(docRef);
  },
}; 
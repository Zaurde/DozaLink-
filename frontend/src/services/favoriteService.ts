import { db } from '@/config/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

export interface Favorite {
  id?: string;
  userId: string;
  adId: string;
  createdAt: Date;
}

export const favoriteService = {
  async getFavorites(userId: string): Promise<string[]> {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().adId);
  },

  async addFavorite(userId: string, adId: string): Promise<void> {
    await addDoc(collection(db, 'favorites'), {
      userId,
      adId,
      createdAt: new Date()
    });
  },

  async removeFavorite(userId: string, adId: string): Promise<void> {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('adId', '==', adId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(doc(db, 'favorites', snapshot.docs[0].id));
    }
  }
}; 
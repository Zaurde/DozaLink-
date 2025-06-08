// Temporarily disabled: Firebase logic removed. Replace with FastAPI logic.
/*
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, writeBatch } from 'firebase/firestore';

export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id?: string;
  participants: string[];
  listingId: string;
  lastMessage?: Message;
  updatedAt: Date;
}

export const chatService = {
  // Neue Nachricht senden
  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<string> {
    const messageData = {
      ...message,
      participants: [message.senderId, message.receiverId],
      timestamp: Timestamp.now(),
      read: false
    };
    
    const docRef = await addDoc(collection(db, 'messages'), messageData);

    // Chat-Dokument anlegen oder aktualisieren
    const chatsRef = collection(db, 'chats');
    const chatQuery = query(
      chatsRef,
      where('participants', 'array-contains', message.senderId),
      where('listingId', '==', message.listingId)
    );
    const chatSnapshot = await getDocs(chatQuery);
    const lastMessage = {
      ...messageData,
      id: docRef.id
    };
    if (chatSnapshot.empty) {
      // Chat existiert noch nicht, also anlegen
      await addDoc(chatsRef, {
        participants: [message.senderId, message.receiverId],
        listingId: message.listingId,
        lastMessage,
        updatedAt: Timestamp.now()
      });
    } else {
      // Chat existiert, also updaten (nur das erste gefundene Dokument)
      const chatDoc = chatSnapshot.docs[0];
      await import('firebase/firestore').then(({ updateDoc }) =>
        updateDoc(chatDoc.ref, {
          lastMessage,
          updatedAt: Timestamp.now()
        })
      );
    }

    return docRef.id;
  },

  // Chat-Verlauf abrufen
  async getChatHistory(listingId: string, userId1: string, userId2: string) {
    const q = query(
      collection(db, 'messages'),
      where('listingId', '==', listingId),
      where('participants', 'array-contains', userId1),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data() as Message & { timestamp: any };
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp && typeof data.timestamp.toDate === 'function'
            ? data.timestamp.toDate()
            : new Date(data.timestamp)
        };
      })
      .filter(msg =>
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      );
  },

  // Alle Chats eines Users abrufen
  async getUserChats(userId: string) {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Chat)
    }));
  },

  // Nachrichten als gelesen markieren
  async markMessagesAsRead(chatId: string, userId: string) {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);

    querySnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  }
};
*/ 
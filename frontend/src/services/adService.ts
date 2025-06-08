export interface Ad {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[]; // URLs
  userId: string;
  createdAt: string; // ISO string from backend
  condition: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const adService = {
  async getAllAds(): Promise<Ad[]> {
    const res = await fetch(`${API_URL}/api/listings`);
    if (!res.ok) throw new Error('Fehler beim Laden der Anzeigen');
    return res.json();
  },

  async getAdById(id: string): Promise<Ad | null> {
    const res = await fetch(`${API_URL}/api/listings/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async createAd(ad: Omit<Ad, 'id' | 'createdAt'>, token: string): Promise<Ad> {
    const res = await fetch(`${API_URL}/api/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ad),
    });
    if (!res.ok) throw new Error('Fehler beim Erstellen der Anzeige');
    return res.json();
  },

  async updateAd(id: string, data: Partial<Ad>, token: string) {
    const res = await fetch(`${API_URL}/api/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Fehler beim Aktualisieren der Anzeige');
    return res.json();
  },

  async deleteAd(id: string, token: string) {
    const res = await fetch(`${API_URL}/api/listings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!res.ok) throw new Error('Fehler beim Löschen der Anzeige');
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/upload-image`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Fehler beim Hochladen des Bildes");
    const data = await res.json();
    return data.url;
  },
}; 
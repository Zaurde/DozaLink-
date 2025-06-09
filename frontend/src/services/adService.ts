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
  async getAllAds(token?: string): Promise<Ad[]> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/api/listings`, { headers });
    if (!res.ok) throw new Error('Fehler beim Laden der Anzeigen');
    if (res.headers.get('content-type')?.includes('application/json')) {
      return res.json();
    } else {
      throw new Error('Server returned non-JSON response');
    }
  },

  async getAdById(id: string, token?: string): Promise<Ad | null> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}/api/listings/${id}`, { headers });
    if (!res.ok) return null;
    if (res.headers.get('content-type')?.includes('application/json')) {
      return res.json();
    } else {
      throw new Error('Server returned non-JSON response');
    }
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
    if (res.headers.get('content-type')?.includes('application/json')) {
      return res.json();
    } else {
      throw new Error('Server returned non-JSON response');
    }
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
    if (res.headers.get('content-type')?.includes('application/json')) {
      return res.json();
    } else {
      throw new Error('Server returned non-JSON response');
    }
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
    if (res.headers.get('content-type')?.includes('application/json')) {
      const data = await res.json();
      return data.url;
    } else {
      throw new Error('Server returned non-JSON response');
    }
  },
}; 
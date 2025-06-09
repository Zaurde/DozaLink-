const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
  user_id: number;
}

export async function getListings(): Promise<Listing[]> {
  const response = await fetch(`${API_URL}/api/listings`);
  if (!response.ok) {
    throw new Error('Failed to fetch listings');
  }
  return response.json();
}

export async function createListing(listing: Omit<Listing, 'id' | 'created_at' | 'user_id'>): Promise<Listing> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}/api/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(listing)
  });

  if (!response.ok) {
    throw new Error('Failed to create listing');
  }

  return response.json();
}

export async function register(email: string, password: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }
}

// Login function is now handled in AuthContext

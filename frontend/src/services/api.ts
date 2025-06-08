const API_URL = import.meta.env.VITE_API_URL;

export interface Listing {
  id?: number;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images?: string[]; // Array von Bild-URLs
}

export async function getListings(): Promise<Listing[]> {
  const res = await fetch(`${API_URL}/api/listings`);
  if (!res.ok) throw new Error("Fehler beim Laden der Listings");
  return res.json();
}

export async function createListing(listing: Omit<Listing, "id">): Promise<Listing> {
  // images als JSON-String senden
  const payload = { ...listing, images: JSON.stringify(listing.images ?? []) };
  const res = await fetch(`${API_URL}/api/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des Listings");
  return res.json();
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

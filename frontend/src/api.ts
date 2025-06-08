export interface Listing {
  id?: number;
  title: string;
  description: string;
}

// ... (getListings bleibt wie gehabt)

const API_URL = import.meta.env.VITE_API_URL;

export async function createListing(listing: Omit<Listing, "id">): Promise<Listing> {
  const res = await fetch(`${API_URL}/api/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listing),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des Listings");
  return res.json();
}

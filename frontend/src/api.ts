export interface Listing {
  id?: number;
  title: string;
  description: string;
}

// ... (getListings bleibt wie gehabt)

export async function createListing(listing: Omit<Listing, "id">): Promise<Listing> {
  const res = await fetch("http://localhost:8000/api/listings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listing),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des Listings");
  return res.json();
}

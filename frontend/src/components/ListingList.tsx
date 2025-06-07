import { useEffect, useState } from "react";
import { getListings, type Listing } from "../services/api";

export default function ListingList() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getListings()
      .then(setListings)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Lade Anzeigen...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <ul>
      {listings.map(listing => (
        <li key={listing.id}>
          <b>{listing.title}</b>: {listing.description}
        </li>
      ))}
    </ul>
  );
}

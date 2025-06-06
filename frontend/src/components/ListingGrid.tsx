import React from "react";
import "./ListingGrid.css";

export type Listing = {
  id: string;
  title: string;
  image: string;
  price: string;
};

export const ListingGrid: React.FC<{ listings: Listing[] }> = ({ listings }) => {
  return (
    <div className="listing-grid">
      {/* Anzeigen begrenzen auf die 20 neuesten */}
      {listings.slice(0, 20).map(listing => (
        <div className="listing-card" key={listing.id}>
          {listing.image && !listing.image.startsWith('data:image') ? (
            <img src={listing.image} alt={listing.title} className="listing-img" />
          ) : (
            <div className="listing-img" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', color: '#aaa', fontSize: 14}}>
              Kein Bild verfügbar
            </div>
          )}
          <div className="listing-title">{listing.title}</div>
          <div className="listing-price">{listing.price}</div>
        </div>
      ))}
    </div>
  );
}; 
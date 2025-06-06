import React, { useState } from "react";

const elektronikCategory = {
  slug: "elektronik",
  title: "Elektronik",
  groups: [
    {
      title: "Smartphones & Zubehör",
      subcategories: [
        "Smartphones",
        "Smartphone-Zubehör",
        "Powerbanks",
        "Ladekabel & Adapter",
        "Hüllen & Schutzglas"
      ],
      filters: ["Marke", "Speichergröße", "Zustand", "Preis"]
    },
    {
      title: "Computer & Tablets",
      subcategories: [
        "Laptops",
        "Tablets",
        "Monitore",
        "PCs & Mac",
        "Tastaturen & Mäuse",
        "Drucker & Scanner"
      ],
      filters: ["Marke", "RAM", "Festplatte", "Prozessor", "Zustand"]
    },
    {
      title: "TV, Audio & Video",
      subcategories: [
        "Fernseher",
        "Beamer",
        "Kopfhörer",
        "Lautsprecher & Soundsysteme",
        "TV-Receiver",
        "Streaming-Geräte"
      ],
      filters: ["Marke", "Bildschirmgröße", "Auflösung", "Zustand"]
    },
    {
      title: "Haushaltsgeräte",
      subcategories: [
        "Waschmaschinen",
        "Kühlschränke",
        "Staubsauger",
        "Kaffeemaschinen",
        "Mikrowellen",
        "Küchenmaschinen"
      ],
      filters: ["Typ", "Marke", "Energieeffizienz", "Zustand"]
    },
    {
      title: "Gaming & Konsolen",
      subcategories: [
        "Spielkonsolen",
        "Gaming-PCs",
        "Controller & Zubehör",
        "VR-Brillen",
        "Spiele (PS/Xbox/PC)"
      ],
      filters: ["Plattform", "Zubehörtyp", "Zustand"]
    },
    {
      title: "Apple & Premium-Marken",
      subcategories: [
        "iPhone",
        "iPad",
        "MacBook",
        "Apple Watch",
        "Apple Zubehör"
      ],
      filters: ["Modell", "Speicher", "Zustand", "Garantie"]
    }
  ]
};

export const ElektronikPage: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

  const group = activeGroup !== null ? elektronikCategory.groups[activeGroup] : null;
  const filters = group ? group.filters : [];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Elektronik</h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20,
        marginBottom: 32
      }}>
        {elektronikCategory.groups.map((g, idx) => (
          <div
            key={g.title}
            style={{
              background: "#f4f6fb",
              borderRadius: 12,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              padding: 20,
              minHeight: 180,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>{g.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {g.subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveGroup(idx)}
                  style={{
                    background: activeGroup === idx ? "#2563EB" : "#fff",
                    color: activeGroup === idx ? "#fff" : "#222",
                    border: "1px solid #e0eaff",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontSize: 15,
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "all 0.15s"
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Filterleiste */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        padding: 18,
        marginBottom: 32,
        minHeight: 60
      }}>
        <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>
          Filter {group ? `für ${group.title}` : ""}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {filters.length === 0
            ? <span style={{ color: "#888" }}>Bitte eine Gruppe wählen</span>
            : filters.map(f => (
              <div key={f} style={{
                background: "#f4f6fb",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 15,
                color: "#2563EB",
                fontWeight: 500
              }}>{f}</div>
            ))}
        </div>
      </div>
      {/* Listings-Placeholder */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        minHeight: 120,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontSize: 20
      }}>
        [Hier erscheinen die passenden Elektronik-Anzeigen]
      </div>
    </div>
  );
}; 
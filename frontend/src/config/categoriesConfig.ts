export type SelectFilter = {
  type: 'select';
  key: string;
  label: string;
  options: string[];
};
export type RangeFilter = {
  type: 'range';
  key: string;
  label: string;
  min: number;
  max: number;
};
export type FilterType = SelectFilter | RangeFilter;

export type Subcategory = { key: string; label: string };
export type CategoryGroup = {
  label: string;
  filters: FilterType[];
  subcategories: Subcategory[];
};

export type CategoryConfig = {
  label: string;
  image: string;
  color: string;
  groups: CategoryGroup[];
};

export const categoriesConfig: Record<string, CategoryConfig> = {
  auto: {
    label: "Auto",
    image: "/images/categories/bmw_156x90_enhanced.png",
    color: "#FFD93D",
    groups: [
      {
        label: "Fahrzeugtypen",
        filters: [
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 100000 },
          { type: "range", key: "year", label: "Erstzulassung", min: 1980, max: 2024 },
          { type: "range", key: "km", label: "Kilometerstand", min: 0, max: 300000 },
          { type: "select", key: "brand", label: "Hersteller", options: ["BMW", "Audi", "VW", "Mercedes"] },
          { type: "select", key: "gearbox", label: "Getriebe", options: ["Automatik", "Manuell"] },
          { type: "select", key: "condition", label: "Zustand", options: ["Neu", "Gebraucht"] }
        ],
        subcategories: [
          { key: "limousine", label: "Limousinen" },
          { key: "suv", label: "SUV & Geländewagen" },
          { key: "kleinwagen", label: "Kleinwagen" },
          { key: "oldtimer", label: "Oldtimer" },
          { key: "nutzfahrzeuge", label: "Nutzfahrzeuge" }
        ]
      }
    ]
  },
  transport: {
    label: "Transport",
    image: "/images/categories/transport.png",
    color: "#B0BEC5",
    groups: [
      {
        label: "Transportarten",
        filters: [
          { type: "select", key: "service", label: "Service", options: ["Umzüge", "Kurierdienste", "Spedition", "Fahrradkurier", "Möbeltransport", "Express-Lieferung"] }
        ],
        subcategories: [
          { key: "umzuege", label: "Umzüge" },
          { key: "kurierdienste", label: "Kurierdienste" },
          { key: "spedition", label: "Spedition" },
          { key: "fahrradkurier", label: "Fahrradkurier" },
          { key: "moebeltransport", label: "Möbeltransport" },
          { key: "expresslieferung", label: "Express-Lieferung" }
        ]
      }
    ]
  },
  jobs: {
    label: "Jobs & Dienstleistungen",
    image: "/images/categories/Jobs.png",
    color: "#D3EDE5",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Job", "Dienstleistung"] },
          { type: "select", key: "zustand", label: "Zustand", options: ["Neu", "Gebraucht"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 10000 }
        ],
        subcategories: [
          { key: "job", label: "Job" },
          { key: "dienstleistung", label: "Dienstleistung" }
        ]
      }
    ]
  },
  elektronik: {
    label: "Elektronik",
    image: "/images/categories/iphone_electronics_icon.png",
    color: "#A0D2EB",
    groups: [
      {
        label: "Geräte",
        filters: [
          { type: "select", key: "brand", label: "Hersteller", options: ["Apple", "Samsung", "Sony", "LG"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 5000 },
          { type: "select", key: "condition", label: "Zustand", options: ["Neu", "Gebraucht"] }
        ],
        subcategories: [
          { key: "handys", label: "Handys" },
          { key: "laptops", label: "Laptops" },
          { key: "tv", label: "TV & Audio" }
        ]
      }
    ]
  },
  computer: {
    label: "Computer & Zubehör",
    image: "/images/categories/Computer.png",
    color: "#B5EAEA",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["PC", "Notebook", "Zubehör"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 5000 }
        ],
        subcategories: [
          { key: "pc", label: "PC" },
          { key: "notebook", label: "Notebook" },
          { key: "zubehoer", label: "Zubehör" }
        ]
      }
    ]
  },
  hausgarten: {
    label: "Haus & Garten",
    image: "/images/categories/Haus.png",
    color: "#A8D5BA",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Möbel", "Garten"] },
          { type: "select", key: "zustand", label: "Zustand", options: ["Neu", "Gebraucht"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 10000 }
        ],
        subcategories: [
          { key: "moebel", label: "Möbel" },
          { key: "garten", label: "Garten" }
        ]
      }
    ]
  },
  moebel: {
    label: "Möbel & Wohnen",
    image: "/images/categories/Möbel.png",
    color: "#EFAE74",
    groups: [
      {
        label: "Bereiche",
        filters: [],
        subcategories: [
          { key: "sofas", label: "Sofas" },
          { key: "tische", label: "Tische" }
        ]
      }
    ]
  },
  kleidung: {
    label: "Kleidung & Mode",
    image: "/images/categories/Kleidung.png",
    color: "#F7D59C",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Damen", "Herren", "Kinder"] }
        ],
        subcategories: [
          { key: "damen", label: "Damen" },
          { key: "herren", label: "Herren" },
          { key: "kinder", label: "Kinder" }
        ]
      }
    ]
  },
  familie: {
    label: "Familie, Kind & Baby",
    image: "/images/categories/Familie.png",
    color: "#FFD4B2",
    groups: [
      {
        label: "Bereiche",
        filters: [],
        subcategories: [
          { key: "spielzeug", label: "Spielzeug" },
          { key: "kinderwagen", label: "Kinderwagen" }
        ]
      }
    ]
  },
  sport: {
    label: "Sport & Freizeit",
    image: "/images/categories/Sport.png",
    color: "#B6F09C",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Sport", "Freizeit"] }
        ],
        subcategories: [
          { key: "sport", label: "Sport" },
          { key: "freizeit", label: "Freizeit" }
        ]
      }
    ]
  },
  reisen: {
    label: "Reisen & Freizeit",
    image: "/images/categories/Reisen.png",
    color: "#6A9BF4",
    groups: [
      {
        label: "Bereiche",
        filters: [],
        subcategories: [
          { key: "fahrrad", label: "Fahrrad" },
          { key: "camping", label: "Camping" }
        ]
      }
    ]
  },
  drogerie: {
    label: "Drogerie & Gesundheit",
    image: "/images/categories/Drogerie.png",
    color: "#D7F48D",
    groups: [
      {
        label: "Bereiche",
        filters: [],
        subcategories: [
          { key: "pflege", label: "Pflege" },
          { key: "gesundheit", label: "Gesundheit" }
        ]
      }
    ]
  },
  geschenke: {
    label: "Geschenke & Deko",
    image: "/images/categories/Geschenke.png",
    color: "#FFD6EC",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Geschenke", "Deko"] }
        ],
        subcategories: [
          { key: "geschenke", label: "Geschenke" },
          { key: "deko", label: "Deko" }
        ]
      }
    ]
  },
  haustiere: {
    label: "Haustiere",
    image: "/images/categories/Haustiere.png",
    color: "#CAB8FF",
    groups: [
      {
        label: "Tierarten",
        filters: [],
        subcategories: [
          { key: "hunde", label: "Hunde" },
          { key: "katzen", label: "Katzen" }
        ]
      }
    ]
  },
  heimwerken: {
    label: "Heimwerken",
    image: "/images/categories/Heimwerk.png",
    color: "#A0F0D0",
    groups: [
      {
        label: "Bereiche",
        filters: [],
        subcategories: [
          { key: "werkzeuge", label: "Werkzeuge" },
          { key: "baustoffe", label: "Baustoffe" }
        ]
      }
    ]
  },
  immobilien: {
    label: "Immobilien",
    image: "/images/categories/immobilien.png",
    color: "#B39DDB",
    groups: [
      {
        label: "Immobilienarten",
        filters: [
          { type: "select", key: "art", label: "Art", options: ["Wohnung", "Haus", "Grundstück", "Gewerbe", "Ferienwohnung"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 2000000 },
          { type: "range", key: "rooms", label: "Zimmer", min: 1, max: 12 }
        ],
        subcategories: [
          { key: "wohnung", label: "Wohnung" },
          { key: "haus", label: "Haus" },
          { key: "grundstueck", label: "Grundstück" },
          { key: "gewerbe", label: "Gewerbe" },
          { key: "ferienwohnung", label: "Ferienwohnung" }
        ]
      }
    ]
  },
  business: {
    label: "Business & Ausrüstung",
    image: "/images/categories/business.png",
    color: "#4A90E2",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Gastronomie", "Einzelhandel", "Produktion", "Büro", "Handwerk"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 1000000 }
        ],
        subcategories: [
          { key: "gastronomie", label: "Gastronomie" },
          { key: "einzelhandel", label: "Einzelhandel" },
          { key: "produktion", label: "Produktion" },
          { key: "buero", label: "Büro" },
          { key: "handwerk", label: "Handwerk" }
        ]
      }
    ]
  },
  kinder: {
    label: "Kinderartikel",
    image: "/images/categories/kinder.png",
    color: "#FF9AA2",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Spielzeug", "Kinderwagen", "Möbel", "Kleidung", "Schulbedarf"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 1000 },
          { type: "select", key: "zustand", label: "Zustand", options: ["Neu", "Gebraucht"] }
        ],
        subcategories: [
          { key: "spielzeug", label: "Spielzeug" },
          { key: "kinderwagen", label: "Kinderwagen" },
          { key: "moebel", label: "Möbel" },
          { key: "kleidung", label: "Kleidung" },
          { key: "schulbedarf", label: "Schulbedarf" }
        ]
      }
    ]
  },
  beauty: {
    label: "Beauty & Gesundheit",
    image: "/images/categories/beauty.png",
    color: "#FFB7B2",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Kosmetik", "Parfüm", "Pflege", "Medizin", "Wellness"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 500 }
        ],
        subcategories: [
          { key: "kosmetik", label: "Kosmetik" },
          { key: "parfuem", label: "Parfüm" },
          { key: "pflege", label: "Pflege" },
          { key: "medizin", label: "Medizin" },
          { key: "wellness", label: "Wellness" }
        ]
      }
    ]
  },
  fertigesGeschaeft: {
    label: "Fertiges Geschäft",
    image: "/images/categories/geschaeft.png",
    color: "#B5EAD7",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Franchise", "Unternehmen", "Beteiligungen"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 1000000 }
        ],
        subcategories: [
          { key: "franchise", label: "Franchise" },
          { key: "unternehmen", label: "Unternehmen" },
          { key: "beteiligungen", label: "Beteiligungen" }
        ]
      }
    ]
  },
  mall: {
    label: "Mall & Neue Produkte",
    image: "/images/categories/mall.png",
    color: "#FF6B6B",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Elektronik", "Mode", "Haushalt", "Sport", "Spielzeug"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 2000 },
          { type: "select", key: "zustand", label: "Zustand", options: ["Neu", "Originalverpackt"] }
        ],
        subcategories: [
          { key: "elektronik", label: "Elektronik" },
          { key: "mode", label: "Mode" },
          { key: "haushalt", label: "Haushalt" },
          { key: "sport", label: "Sport" },
          { key: "spielzeug", label: "Spielzeug" }
        ]
      }
    ]
  },
  ersatzteile: {
    label: "Ersatzteile & Zubehör",
    image: "/images/categories/ersatzteile.png",
    color: "#4ECDC4",
    groups: [
      {
        label: "Bereiche",
        filters: [
          { type: "select", key: "bereich", label: "Bereich", options: ["Auto", "Motorrad", "Fahrrad", "Elektronik", "Haushalt"] },
          { type: "range", key: "price", label: "Preis (€)", min: 0, max: 1000 },
          { type: "select", key: "zustand", label: "Zustand", options: ["Neu", "Gebraucht", "Original"] }
        ],
        subcategories: [
          { key: "auto", label: "Auto" },
          { key: "motorrad", label: "Motorrad" },
          { key: "fahrrad", label: "Fahrrad" },
          { key: "elektronik", label: "Elektronik" },
          { key: "haushalt", label: "Haushalt" }
        ]
      }
    ]
  },
}; 
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { categoriesConfig } from '../config/categoriesConfig';
import type { CategoryConfig, CategoryGroup, Subcategory, FilterType, RangeFilter, SelectFilter } from '../config/categoriesConfig';
import { ListingGrid } from '../components/ListingGrid';
import type { Listing } from '../components/ListingGrid';

// Typen für FilterPanel importieren oder erneut definieren

type FilterValues = Record<string, any>;

function FilterPanel({ filters, values, onChange }: {
  filters: FilterType[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, margin: '16px 0' }}>
      {filters.map((filter) => (
        <FilterField
          key={filter.key}
          filter={filter}
          value={values[filter.key]}
          onChange={(val) => onChange(filter.key, val)}
        />
      ))}
    </div>
  );
}

function FilterField({ filter, value, onChange }: { filter: FilterType; value: any; onChange: (value: any) => void }) {
  if (filter.type === "select") {
    return (
      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14, minWidth: 120 }}>
        {filter.label}
        <select value={value || ""} onChange={e => onChange(e.target.value)} style={{ marginTop: 4, padding: 4 }}>
          <option value="">Alle</option>
          {(filter as SelectFilter).options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>
    );
  }
  if (filter.type === "range") {
    return (
      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14, minWidth: 120 }}>
        {filter.label}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <input
            type="number"
            min={(filter as RangeFilter).min}
            max={(filter as RangeFilter).max}
            value={value?.min || ""}
            onChange={e => onChange({ ...value, min: e.target.value })}
            placeholder="Min"
            style={{ width: 60, padding: 4 }}
          />
          <input
            type="number"
            min={(filter as RangeFilter).min}
            max={(filter as RangeFilter).max}
            value={value?.max || ""}
            onChange={e => onChange({ ...value, max: e.target.value })}
            placeholder="Max"
            style={{ width: 60, padding: 4 }}
          />
        </div>
      </label>
    );
  }
  return null;
}

export const CategoryPage: React.FC = () => {
  const { slug, sub } = useParams<{ slug: string; sub?: string }>();
  const navigate = useNavigate();
  const category: CategoryConfig | undefined = slug ? categoriesConfig[slug] : undefined;
  const [filterValues, setFilterValues] = React.useState<Record<string, any>>({});

  if (!category) {
    return <div style={{ padding: 24 }}>Kategorie nicht gefunden.</div>;
  }

  // Finde aktive Subkategorie und Gruppe
  let activeGroup: CategoryGroup | undefined;
  let activeSub: Subcategory | undefined;
  category.groups.forEach(group => {
    const found = group.subcategories.find(s => s.key === sub);
    if (found) {
      activeGroup = group;
      activeSub = found;
    }
  });
  // Wenn keine Subkategorie aktiv, Standard: erste Gruppe
  if (!activeGroup) activeGroup = category.groups[0];

  // Demo-Listings (später durch echte Daten ersetzen)
  const demoListings: Listing[] = [
    { id: '1', title: 'BMW 320d Limousine', image: '/images/demo/bmw.jpg', price: '12.900 €' },
    { id: '2', title: 'Audi Q5 SUV', image: '/images/demo/audi.jpg', price: '18.500 €' },
    { id: '3', title: 'iPhone 13 Pro', image: '/images/demo/iphone.jpg', price: '799 €' },
    { id: '4', title: 'Samsung TV 55"', image: '/images/demo/tv.jpg', price: '399 €' },
    { id: '5', title: 'Gartenmöbel Set', image: '/images/demo/garten.jpg', price: '249 €' },
    { id: '6', title: 'MacBook Air', image: '/images/demo/macbook.jpg', price: '999 €' },
    { id: '7', title: 'VW Golf', image: '/images/demo/vw.jpg', price: '8.900 €' },
    { id: '8', title: 'Sony PlayStation 5', image: '/images/demo/ps5.jpg', price: '499 €' },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
      {/* Titel und Bild */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18, flexWrap: 'wrap' }}>
        <img src={category.image} alt={category.label} style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 12, background: '#f4f6fb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }} />
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{category.label}</h1>
      </div>
      {/* Gruppen & Subkategorien */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginBottom: 28 }}>
        {category.groups.map((group, gIdx) => (
          <div key={group.label} style={{ background: '#f4f6fb', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 18, minHeight: 120 }}>
            <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 10 }}>{group.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {/* Alle anzeigen Button */}
              {gIdx === 0 && (
                <button
                  onClick={() => navigate(`/kategorien/${slug}`)}
                  className={!activeSub ? 'active' : ''}
                  style={{
                    background: !activeSub ? '#2563EB' : '#fff',
                    color: !activeSub ? '#fff' : '#222',
                    border: '1px solid #e0eaff',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontSize: 15,
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.15s',
                  }}
                >Alle anzeigen</button>
              )}
              {group.subcategories.map(subcat => (
                <Link
                  key={subcat.key}
                  to={`/kategorien/${slug}/${subcat.key}`}
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    className={activeSub && activeSub.key === subcat.key ? 'active' : ''}
                    style={{
                      background: activeSub && activeSub.key === subcat.key ? '#2563EB' : '#fff',
                      color: activeSub && activeSub.key === subcat.key ? '#fff' : '#222',
                      border: '1px solid #e0eaff',
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontSize: 15,
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'all 0.15s',
                    }}
                  >
                    {subcat.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* FilterPanel */}
      <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 18, marginBottom: 32, minHeight: 60 }}>
        <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>
          Filter {activeSub ? `für ${activeSub.label}` : `für ${activeGroup.label}`}
        </div>
        <FilterPanel
          filters={activeGroup.filters}
          values={filterValues}
          onChange={(key, value) => setFilterValues(prev => ({ ...prev, [key]: value }))}
        />
      </div>
      {/* Listings-Grid */}
      <ListingGrid listings={demoListings} />
    </div>
  );
}; 
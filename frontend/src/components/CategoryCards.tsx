import React from "react";
import { useNavigate } from "react-router-dom";
import { categoriesConfig } from "../config/categoriesConfig";
import "./CategoryCards.css";

const stickyRotations = [-3, 2, -1.5, 1, 2.5, -2, 1.5, -2.5];

export const CategoryCards: React.FC = () => {
  const navigate = useNavigate();
  const categories = Object.entries(categoriesConfig);
  return (
    <div className="categories-grid">
      {categories.map(([slug, cat], idx) => {
        const color = cat.color;
        const rotate = stickyRotations[idx % stickyRotations.length];
        const label = cat.label.toLowerCase();
        const isReisen = label.includes('reisen');
        const isHaus = label.includes('haus');
        const isFamilie = label.includes('familie');
        const isElektronik = label.includes('elektronik');
        const isAuto = label.includes('auto');
        const isHaustier = label.includes('haustier');
        let imageStyle: React.CSSProperties | undefined = undefined;
        if (isReisen || isHaus || isFamilie) {
          imageStyle = { transform: 'scale(1.3) translateY(-20%)' };
        } else if (isElektronik) {
          imageStyle = { transform: 'scale(1.3)' };
        } else if (isAuto) {
          imageStyle = { transform: 'scale(1.2)' };
        } else if (isHaustier) {
          imageStyle = { transform: 'scale(0.8) translateY(30%)' };
        }
        return (
          <div
            key={slug}
            className="category-card sticky-note-card"
            onClick={() => navigate(`/kategorien/${slug}`)}
          >
            <div
              className="note-paper"
              style={{
                '--note-color': color,
                '--note-rotate': `${rotate}deg`
              } as React.CSSProperties}
            >
              <svg className="note-clip" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.364 5.636a5 5 0 0 0-7.07 0l-6.364 6.364a5 5 0 0 0 7.07 7.07l6.364-6.364a3 3 0 0 0-4.243-4.243l-6.364 6.364"/>
              </svg>
              <img className="note-image" src={cat.image} alt={cat.label} style={imageStyle} />
            </div>
            <div className="card-label card-label-small">
              <h3>{cat.label.split(/\s*&\s*/)[0]}</h3>
              {(cat as any).subtitle && <p>{(cat as any).subtitle}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 
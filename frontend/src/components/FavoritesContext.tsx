import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface FavoritesContextType {
  favorites: number[];
  add: (id: number) => Promise<void>;
  remove: (id: number) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  add: async () => {},
  remove: async () => {},
  loading: false,
});

const FAVORITES_KEY = 'demo_favorites';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    setFavorites(favs);
  }, []);

  const add = async (id: number) => {
    setLoading(true);
    let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    if (!favs.includes(id)) {
      favs.push(id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
      setFavorites(favs);
    }
    setLoading(false);
  };

  const remove = async (id: number) => {
    setLoading(true);
    let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    favs = favs.filter((fid: number) => fid !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    setFavorites(favs);
    setLoading(false);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, add, remove, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext); 
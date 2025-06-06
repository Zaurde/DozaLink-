import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { favoriteService } from '../services/favoriteService';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const favs = await favoriteService.getFavorites(user.id);
        setFavorites(favs);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const toggleFavorite = async (adId: string) => {
    if (!user) return;

    try {
      if (favorites.includes(adId)) {
        await favoriteService.removeFavorite(user.id, adId);
        setFavorites(favorites.filter(id => id !== adId));
      } else {
        await favoriteService.addFavorite(user.id, adId);
        setFavorites([...favorites, adId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite: (adId: string) => favorites.includes(adId)
  };
}; 
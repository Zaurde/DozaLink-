import { Box, Typography, Skeleton, Alert } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { adService } from '../services/adService';
import AdCard from './AdCard';
import Snackbar from '@mui/material/Snackbar';

// Hilfsfunktion für Sortierung
const sortAds = (ads: any[], sort: string) => {
  if (sort === 'price_asc') return [...ads].sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') return [...ads].sort((a, b) => b.price - a.price);
  // Standard: keine Sortierung oder nach ID (neueste zuerst)
  return [...ads].sort((a, b) => b.id - a.id);
};

export const ListingGridFull = ({ category, subcategory, search, location, priceMin, priceMax, sort }: { category?: string, subcategory?: string, search?: string, location?: string, priceMin?: string, priceMax?: string, sort?: string }) => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites } = useFavorites();
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    setLoading(true);
    adService.getAllAds()
      .then(res => {
        setAds(res);
        setError(null);
      })
      .catch(() => {
        setAds([]);
        setError('Anzeigen konnten nicht geladen werden.');
      })
      .finally(() => setLoading(false));
    // Kategorien können ggf. aus einer anderen Quelle geladen werden
    // setCategories(...)
  }, []);


  // Filter-Logik: Zeige Anzeigen auch, wenn Filter leer sind
  let filteredAds = ads.filter((ad: any) => {
    const matchesCategory = category ? ad.category === category : true;
    const matchesSubcategory = subcategory ? ad.subcategory === subcategory : true;
    const matchesSearch = search ? ad.title?.toLowerCase().includes(search.toLowerCase()) : true;
    const matchesPriceMin = priceMin ? ad.price >= parseInt(priceMin) : true;
    const matchesPriceMax = priceMax ? ad.price <= parseInt(priceMax) : true;
    const matchesLocation = location ? ad.location?.toLowerCase().includes(location.toLowerCase()) : true;
    return matchesCategory && matchesSubcategory && matchesSearch && matchesPriceMin && matchesPriceMax && matchesLocation;
  });
  filteredAds = sortAds(filteredAds, sort || 'newest');

  // Warnung, falls alle Anzeigen herausgefiltert werden
  if (!loading && ads.length > 0 && filteredAds.length === 0) {
    console.warn('Alle Anzeigen wurden durch die Filter herausgefiltert!');
  }

  if (loading) return (
    <Box sx={{ p: 4 }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr',
        },
        gap: 2,
      }}>
        {[...Array(6)].map((_, i) => (
          <Box key={i} sx={{ width: '100%' }}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 1 }} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="80%" />
          </Box>
        ))}
      </Box>
    </Box>
  );
  if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Für dich empfohlen
      </Typography>

      {filteredAds.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <SentimentDissatisfiedIcon sx={{ fontSize: 48, mb: 1, color: 'grey.400' }} />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Keine Anzeigen gefunden
          </Typography>
          <Typography variant="body2">Passe deine Filter oder Suchbegriffe an.</Typography>
        </Box>
      ) : (
        <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 1,
            width: '100%',
          }}>
            {/* Anzeigen begrenzen auf die 20 neuesten */}
            {filteredAds.slice(0, 20).map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <AdCard
                  key={String(item.id)}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  location={item.location}
                  category={item.category}
                  condition={item.condition}
                  images={item.images}
                  isFavorite={isFav}
                  description={item.description}
                  userId={item.userId}
                  createdAt={item.createdAt}
                />
              );
            })}
          </Box>
        </Box>
      )}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar('')}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}; 
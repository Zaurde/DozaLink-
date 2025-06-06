import { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../components/FavoritesContext';
import { ListingGridFull } from '../components/ListingGridFull';

export const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Merkliste
        </Typography>
        
        <ListingGridFull search="" />
      </Container>
    </Box>
  );
}; 
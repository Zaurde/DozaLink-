import { Box, Container, Typography } from '@mui/material';
import { ListingGridFull } from '../components/ListingGridFull';

export const FavoritesPage = () => {
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
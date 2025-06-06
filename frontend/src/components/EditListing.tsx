import { Box, Typography, Container, Paper } from '@mui/material';
import { ListingEditForm } from './ListingEditForm';
import { useParams } from 'react-router-dom';

export const EditListing = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: 3 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Anzeige bearbeiten
          </Typography>
          
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <ListingEditForm id={id} />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}; 
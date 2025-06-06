import { Box, Typography, Container, Paper } from '@mui/material';
import { ListingForm } from './ListingForm';

export const CreateListing = () => {
  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: 3 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Neue Anzeige erstellen
          </Typography>
          
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <ListingForm />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}; 
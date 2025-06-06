import { Box, Typography, Container, Paper, Button, Stack } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ width: '100%', py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: 3 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Profil
          </Typography>
          
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Name
                </Typography>
                <Typography variant="body1">
                  {user?.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  E-Mail
                </Typography>
                <Typography variant="body1">
                  {user?.email}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ alignSelf: 'flex-start' }}
              >
                Abmelden
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}; 
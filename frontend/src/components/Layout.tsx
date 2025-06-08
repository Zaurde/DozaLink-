import { Box, Typography, Button, IconButton } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DrawerMenu } from './DrawerMenu';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="header"
        className="header"
        sx={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 3000,
          px: { xs: 0, sm: 0 },
          py: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            minHeight: 48,
            px: 1.5,
            py: 0.5,
            boxSizing: 'border-box',
            gap: 1,
          }}
        >
          <IconButton 
            sx={{ 
              minWidth: 44, 
              minHeight: 44, 
              p: 1, 
              mr: 1, 
              display: 'inline-flex !important' 
            }} 
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flex: 1,
              textAlign: 'center',
              fontWeight: 700,
              color: 'primary.main',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              cursor: 'pointer',
              userSelect: 'none',
              letterSpacing: 0.2,
              px: 1,
            }}
            onClick={() => navigate('/')}
          >
            Kleinanzeigen
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 1, 
                    display: { xs: 'none', sm: 'block' },
                    color: 'text.secondary'
                  }}
                >
                  {user.email}
                </Typography>
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={logout} 
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    color: 'text.secondary'
                  }}
                >
                  Logout
                </Button>
                <IconButton 
                  color="primary" 
                  onClick={() => navigate('/profile')} 
                  sx={{ 
                    minWidth: 44, 
                    minHeight: 44,
                    display: { xs: 'flex', sm: 'none' }
                  }}
                >
                  <PersonIcon />
                </IconButton>
              </>
            ) : (
              <Button 
                color="primary" 
                component={Link} 
                to="/login" 
                size="small"
                sx={{
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Kleinanzeigen. Alle Rechte vorbehalten.
        </Typography>
      </Box>
    </Box>
  );
}; 
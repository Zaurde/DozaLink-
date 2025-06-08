import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const BottomNav = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/favorites');
        break;
      case 2:
        navigate('/new');
        break;
      case 3:
        navigate('/chat');
        break;
      case 4:
        navigate(user ? '/profile' : '/login');
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        display: { xs: 'block', sm: 'none' },
        borderTop: '1px solid #eee',
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{ 
          bgcolor: '#fff',
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px',
          }
        }}
      >
        <BottomNavigationAction 
          label="Suchen" 
          icon={<SearchIcon />} 
        />
        <BottomNavigationAction 
          label="Favoriten" 
          icon={<FavoriteBorderIcon />} 
        />
        <BottomNavigationAction 
          label="Inserieren" 
          icon={<AddCircleOutlineIcon sx={{ fontSize: 32 }} color="primary" />} 
        />
        <BottomNavigationAction 
          label="Chat" 
          icon={<ChatBubbleOutlineIcon />} 
        />
        <BottomNavigationAction 
          label={user ? "Profil" : "Login"} 
          icon={<PersonOutlineIcon />} 
        />
      </BottomNavigation>
    </Paper>
  );
}; 
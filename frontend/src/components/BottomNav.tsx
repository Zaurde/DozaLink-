import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const BottomNav = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
    if (newValue === 1) navigate('/favorites');
    if (newValue === 0) navigate('/');
    if (newValue === 2) navigate('/new');
    // Weitere Navigationen können ergänzt werden
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
        sx={{ bgcolor: '#fff' }}
      >
        <BottomNavigationAction label="Suchen" icon={<SearchIcon />} />
        <BottomNavigationAction label="Favoriten" icon={<FavoriteBorderIcon />} />
        <BottomNavigationAction label="Inserieren" icon={<AddCircleOutlineIcon sx={{ fontSize: 32 }} color="primary" />} />
        <BottomNavigationAction label="Nachrichten" icon={<ChatBubbleOutlineIcon />} />
        <BottomNavigationAction label="Meins" icon={<PersonOutlineIcon />} />
      </BottomNavigation>
    </Paper>
  );
}; 
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PetsIcon from '@mui/icons-material/Pets';
import BuildIcon from '@mui/icons-material/Build';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'Auto, Rad & Boot', icon: <DirectionsCarIcon /> },
  { label: 'Haus & Garten', icon: <HomeWorkIcon /> },
  { label: 'Mode & Beauty', icon: <CheckroomIcon /> },
  { label: 'Elektronik', icon: <SmartphoneIcon /> },
  { label: 'Familie, Kind & Baby', icon: <ChildCareIcon /> },
  { label: 'Haustiere', icon: <PetsIcon /> },
  { label: 'Heimwerken', icon: <BuildIcon /> },
  { label: 'Weitere Kategorien', icon: <MoreHorizIcon /> },
];

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

export const DrawerMenu = ({ open, onClose }: DrawerMenuProps) => {
  const navigate = useNavigate();
  return (
    <Drawer anchor="left" open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
      <Box sx={{ width: 270, pt: 1 }} role="presentation">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>Kleinanzeigen</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <List>
          <ListItemButton onClick={() => { navigate('/'); onClose(); }}>
            <ListItemIcon><HomeIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Start" />
          </ListItemButton>
          <ListItemButton onClick={() => { navigate('/favorites'); onClose(); }}>
            <ListItemIcon><FavoriteBorderIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Merkliste" />
          </ListItemButton>
          <ListItemButton onClick={() => { navigate('/chat'); onClose(); }}>
            <ListItemIcon><ChatBubbleOutlineIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Nachrichten" />
          </ListItemButton>
          <ListItemButton onClick={() => { navigate('/new'); onClose(); }}>
            <ListItemIcon><AddCircleOutlineIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Anzeige aufgeben" />
          </ListItemButton>
        </List>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 600 }}>
          Kategorien
        </Typography>
        <List>
          {categories.map((cat) => (
            <ListItemButton key={cat.label}>
              <ListItemIcon>{cat.icon}</ListItemIcon>
              <ListItemText primary={cat.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <List>
          <ListItemButton>
            <ListItemIcon><SettingsIcon color="action" /></ListItemIcon>
            <ListItemText primary="Einstellungen" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon><LogoutIcon color="action" /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}; 
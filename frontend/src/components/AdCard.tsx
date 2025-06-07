import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link as RouterLink } from 'react-router-dom';
import type { Ad } from '../services/adService';

interface AdCardProps extends Ad {
  id: string;
}

const AdCard: React.FC<AdCardProps> = ({ id, title, price, location, images }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      component={RouterLink}
      to={`/listing/${id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: 236,
        minWidth: 236,
        maxWidth: 236,
        height: 354,
        minHeight: 354,
        maxHeight: 354,
        bgcolor: '#fff',
        borderRadius: 2.5,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          transform: 'scale(1.02)',
        },
        userSelect: 'text',
      }}
    >
      {/* Favoriten-Icon oben rechts */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: 'rgba(255,255,255,0.85)',
          '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
        }}
        onClick={e => e.preventDefault()}
        aria-label="Favorit"
      >
        <FavoriteBorderIcon fontSize="medium" />
      </IconButton>
      {/* Drei-Punkte-Menü oben rechts, leicht darunter */}
      <IconButton
        sx={{
          position: 'absolute',
          top: 44,
          right: 8,
          zIndex: 2,
          bgcolor: 'rgba(255,255,255,0.85)',
          '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
        }}
        onClick={handleMenuOpen}
        aria-label="Mehr"
      >
        <MoreVertIcon fontSize="medium" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} onClick={e => e.stopPropagation()}>
        <MenuItem onClick={handleMenuClose}>Merken</MenuItem>
        <MenuItem onClick={handleMenuClose}>Teilen</MenuItem>
      </Menu>
      {/* Bild */}
      <Box
        sx={{
          width: '100%',
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          background: '#f7f7f7',
        }}
      >
        <img
          src={images && images.length > 0 ? images[0] : '/placeholder.jpg'}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            display: 'block',
          }}
        />
      </Box>
      {/* Inhalt */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, pt: 1.5, gap: 0.5 }}>
        <Typography
          variant="subtitle1"
          component="a"
          href={`/listing/${id}`}
          sx={{
            fontWeight: 600,
            fontSize: 17,
            color: 'inherit',
            textDecoration: 'none',
            mb: 0.5,
            '&:hover': { textDecoration: 'underline' },
            cursor: 'pointer',
            userSelect: 'text',
          }}
          onClick={e => e.stopPropagation()}
        >
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 0.5, fontSize: 20 }}>
          {price ? `${price} €` : ''}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14, mt: 'auto' }}>
          {location}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdCard; 
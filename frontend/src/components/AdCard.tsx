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

  // Avito-like image carousel on hover
  const [activeIdx, setActiveIdx] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);
  const imgs = images && images.length > 0 ? images : ['/placeholder.jpg'];

  const handleMouseEnter = () => {
    if (imgs.length <= 1) return;
    intervalRef.current = window.setInterval(() => {
      setActiveIdx(idx => (idx + 1) % imgs.length);
    }, 1200);
  };
  const handleMouseLeave = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setActiveIdx(0);
  };
  React.useEffect(() => () => { if (intervalRef.current) window.clearInterval(intervalRef.current); }, []);

  return (
    <Box
      sx={{
        width: 236,
        minWidth: 236,
        maxWidth: 236,
        height: 354,
        minHeight: 354,
        maxHeight: 354,
        bgcolor: '#fff',
        borderRadius: 3,
        boxShadow: 'none',
        transition: 'box-shadow 0.2s',
        fontFamily: 'Inter, Roboto, system-ui, Arial, sans-serif',
        overflow: 'hidden',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
        },
      }}
    >
      {/* Bildbereich mit Avito-Blur-Background und Icons */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 180,
          overflow: 'hidden',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          bgcolor: '#f7f7f7',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Blurred Background */}
        <Box
          component="img"
          src={imgs[activeIdx]}
          alt=""
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'blur(18px) brightness(1.1) opacity(0.7)',
            zIndex: 1,
            transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)',
          }}
        />
        {/* Main Image */}
        <Box
          component="img"
          src={imgs[activeIdx]}
          alt={title}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            zIndex: 2,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            background: '#f3f4f6',
            display: 'block',
            transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)',
          }}
        />
        {/* Favoriten-Icon oben rechts */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 44,
            zIndex: 3,
            bgcolor: 'rgba(255,255,255,0.85)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
          onClick={e => e.preventDefault()}
          aria-label="Favorit"
        >
          <FavoriteBorderIcon fontSize="medium" />
        </IconButton>
        {/* Drei-Punkte-Menü oben rechts */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 3,
            bgcolor: 'rgba(255,255,255,0.85)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
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
      </Box>
      {/* Card Body */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 2, pt: 2, pb: 1.5, gap: 0.5, alignItems: 'flex-start' }}>
        <Typography
          variant="subtitle1"
          component={RouterLink}
          to={`/listing/${id}`}
          sx={{
            fontWeight: 700,
            fontSize: 17,
            color: 'primary.main',
            textDecoration: 'none',
            mb: 0.5,
            '&:hover': { textDecoration: 'underline' },
            cursor: 'pointer',
            userSelect: 'text',
            textAlign: 'left',
            lineHeight: 1.2,
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#222', mb: 0.5, fontSize: 22, textAlign: 'left', lineHeight: 1.2 }}>
          {price ? `${price} €` : ''}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14, mt: 'auto', textAlign: 'left', width: '100%' }}>
          {location}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdCard; 
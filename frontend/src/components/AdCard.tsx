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
        bgcolor: '#f8fafc',
        borderRadius: '12px',
        boxShadow: 'none',
        transition: 'box-shadow 0.18s',
        fontFamily: 'Manrope, Inter, system-ui, Arial, sans-serif',
        overflow: 'hidden',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Bildbereich mit Avito-Blur-Background und Icons */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 236,
          overflow: 'hidden',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          bgcolor: '#fff',
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
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
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
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            display: 'block',
            transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)',
          }}
        />
        {/* Favoriten-Icon oben rechts */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 38,
            width: 22,
            height: 22,
            zIndex: 3,
            bgcolor: 'rgba(255,255,255,0.85)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            p: 0.5,
          }}
          onClick={e => e.preventDefault()}
          aria-label="Favorit"
        >
          <FavoriteBorderIcon fontSize="small" />
        </IconButton>
        {/* Drei-Punkte-Menü oben rechts */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 22,
            height: 22,
            zIndex: 3,
            bgcolor: 'rgba(255,255,255,0.85)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            p: 0.5,
          }}
          onClick={handleMenuOpen}
          aria-label="Mehr"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} onClick={e => e.stopPropagation()}>
          <MenuItem onClick={handleMenuClose}>Merken</MenuItem>
          <MenuItem onClick={handleMenuClose}>Teilen</MenuItem>
        </Menu>
      </Box>
      {/* Card Body */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 1.5, pt: 1, pb: 1, gap: 0.3, alignItems: 'flex-start', background: 'transparent', boxShadow: 'none', border: 'none', minHeight: 0, justifyContent: 'center' }}>
        <Typography
          variant="subtitle1"
          component={RouterLink}
          to={`/listing/${id}`}
          sx={{
            fontWeight: 700,
            fontSize: 15,
            lineHeight: '20px',
            color: 'primary.main',
            textDecoration: 'none',
            mb: 0.5,
            width: '100%',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#222', mb: 0.5, fontSize: 16, textAlign: 'left', lineHeight: '20px' }}>
          {price ? `${price} €` : ''}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13, lineHeight: '20px', mt: 'auto', textAlign: 'left', width: '100%' }}>
          {location}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdCard; 
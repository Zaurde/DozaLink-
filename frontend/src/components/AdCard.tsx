import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NoImageIcon from '@mui/icons-material/Image';
import { Link as RouterLink } from 'react-router-dom';
import type { Ad } from '../services/adService';

interface AdCardProps extends Ad {
  id: string;
  isFavorite?: boolean;
}

const AdCard: React.FC<AdCardProps> = ({ id, title, price, location, images, category, isFavorite }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // Bildwechsel per Mausbewegung: Bildfläche in Zonen teilen, Maus steuert Bild
  const [activeIdx, setActiveIdx] = React.useState(0);
  const imgs = images && images.length > 0 ? images : ['/placeholder.jpg'];

  // Handler für Mausbewegung über das Bild
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (imgs.length <= 1) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const zoneWidth = rect.width / imgs.length;
    const idx = Math.min(imgs.length - 1, Math.floor(x / zoneWidth));
    setActiveIdx(idx);
  };
  // Beim Verlassen zurück auf erstes Bild
  const handleMouseLeave = () => setActiveIdx(0);

  // Animation for fade
  const [fade, setFade] = React.useState(true);
  React.useEffect(() => { setFade(false); const t = setTimeout(() => setFade(true), 80); return () => clearTimeout(t); }, [activeIdx]);

  return (
    <Box
      sx={{
        width: { xs: '100%', md: 236 },
        minWidth: { xs: 0, md: 236 },
        maxWidth: { xs: '100%', md: 236 },
        height: { xs: 'auto', md: 354 },
        minHeight: { xs: 0, md: 354 },
        maxHeight: { xs: 'none', md: 354 },
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
      {/* Bildbereich mit Blur-Background und Icons */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 'auto', md: 236 },
          aspectRatio: { xs: '1 / 1', md: 'unset' },
          overflow: 'hidden',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          bgcolor: '#fff',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Kategorie-Badge */}
        {category && (
          <Box sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            bgcolor: 'primary.main',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            px: 1,
            py: 0.2,
            borderRadius: 1,
            zIndex: 4,
            letterSpacing: 0.2,
            textTransform: 'uppercase',
          }}>{category}</Box>
        )}
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
        {/* Main Image or Placeholder */}
        {imgs[activeIdx] && !imgs[activeIdx].includes('placeholder') ? (
          <Box
            component="img"
            src={imgs[activeIdx]}
            alt={`${title} – Bild ${activeIdx + 1}`}
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              zIndex: 2,
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              display: 'block',
              opacity: fade ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          />
        ) : (
          <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            bgcolor: '#f3f4f6',
          }}>
            <NoImageIcon sx={{ fontSize: 48, color: 'grey.400' }} />
          </Box>
        )}
        {/* Favoriten-Icon oben rechts */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 38,
            width: { xs: 32, sm: 22 },
            height: { xs: 32, sm: 22 },
            zIndex: 3,
            bgcolor: 'rgba(255,255,255,0.85)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            p: 0.5,
          }}
          onClick={e => e.preventDefault()}
          aria-label={isFavorite ? 'Favorit entfernen' : 'Favorit setzen'}
          title={isFavorite ? 'Favorit entfernen' : 'Favorit setzen'}
        >
          {isFavorite ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
        {/* Drei-Punkte-Menü oben rechts */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: { xs: 32, sm: 22 },
            height: { xs: 32, sm: 22 },
            zIndex: 3,
            bgcolor: 'rgba(255,255,255,0.85)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            p: 0.5,
          }}
          onClick={handleMenuOpen}
          aria-label="Mehr Optionen"
          title="Mehr Optionen"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} onClick={e => e.stopPropagation()}>
          <MenuItem onClick={handleMenuClose}>Merken</MenuItem>
          <MenuItem onClick={handleMenuClose}>Teilen</MenuItem>
        </Menu>
        {/* Karussell-Indikatoren */}
        {imgs.length > 1 && (
          <Box sx={{
            position: 'absolute',
            left: '50%',
            bottom: 8,
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5,
            zIndex: 4,
          }}>
            {imgs.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: idx === activeIdx ? 'primary.main' : 'grey.300',
                  opacity: idx === activeIdx ? 1 : 0.5,
                }}
              />
            ))}
          </Box>
        )}
      </Box>
      {/* Card Body */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 1, pt: 1, pb: 1, gap: 0.3, alignItems: 'flex-start', background: 'transparent', boxShadow: 'none', border: 'none', minHeight: 0, justifyContent: 'center' }}>
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
            transition: 'text-decoration 0.15s',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5, fontSize: 16, textAlign: 'left', lineHeight: '20px' }}>
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
import { Box, Typography, IconButton, Chip, Stack } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NoImageIcon from '@mui/icons-material/Image';
import Link from '@mui/material/Link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useRef, useEffect } from 'react';

interface AvitoListingItemProps {
  id: string | number;
  title: string;
  price: number;
  location: string;
  category?: string;
  condition?: string;
  image?: string;
  images?: string[];
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string | number, isFav: boolean) => void;
  disabled?: boolean;
  onClick?: () => void;
}

export const AvitoListingItem = ({
  id,
  title,
  price,
  location,
  category,
  condition,
  image,
  images,
  isFavorite,
  onFavoriteToggle,
  disabled,
  onClick,
}: AvitoListingItemProps) => {
  // Karussell-Logik
  const imgs = images && images.length > 0 ? images : image ? [image] : [];
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

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
  useEffect(() => () => { if (intervalRef.current) window.clearInterval(intervalRef.current); }, []);

  // MouseMove-Handler für intelligentes Vorschauverhalten
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (imgs.length <= 1 || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    // Mappe X-Position auf Bild-Index
    let idx = Math.floor((x / width) * imgs.length);
    idx = Math.max(0, Math.min(imgs.length - 1, idx));
    setActiveIdx(idx);
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };
  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <Box
      sx={{
        width: 236,
        minWidth: 236,
        maxWidth: 236,
        height: { xs: 236, md: 340 },
        minHeight: { xs: 236, md: 340 },
        maxHeight: { xs: 236, md: 340 },
        margin: 'auto',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        p: 0,
        overflow: 'visible',
        '&:hover': {
          // Kein boxShadow, kein transform, keine optische Änderung mehr
        },
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        ref={boxRef}
        sx={{ position: 'relative', width: '100%', height: { xs: 196, md: 236 }, minHeight: { xs: 196, md: 236 }, maxHeight: { xs: 196, md: 236 }, borderRadius: '12px 12px 0 0', overflow: 'hidden' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={imgs.length > 1 ? undefined : handleMouseEnter}
      >
        {imgs.length > 0 ? (
          <>
            {/* Unscharfer, blasser Hintergrund */}
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
            {/* Hauptbild */}
            <Box
              component="img"
              src={imgs[activeIdx]}
              alt={title}
              loading="lazy"
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                zIndex: 2,
                background: 'background.default',
                display: 'block',
                cursor: 'pointer',
                transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)',
              }}
              onClick={onClick}
            />
          </>
        ) : (
          <Box sx={{
            width: '100%',
            aspectRatio: '1 / 1',
            minHeight: 180,
            maxHeight: 320,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            borderRadius: '12px 12px 0 0',
          }}>
            <NoImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="caption" color="text.secondary">Kein Bild verfügbar</Typography>
          </Box>
        )}
        {/* Indikator-Punkte */}
        {imgs.length > 1 && (
          <Box sx={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            display: 'flex',
            gap: 0.5,
            zIndex: 2,
          }}>
            {imgs.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  bgcolor: idx === activeIdx ? 'primary.main' : 'background.paper',
                  opacity: idx === activeIdx ? 1 : 0.6,
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              />
            ))}
          </Box>
        )}
        <IconButton
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'background.paper',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            width: 36,
            height: 36,
            borderRadius: '50%',
            p: 1,
            transition: 'all 0.2s',
            '&:hover': { 
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            },
          }}
          aria-label="Favorit"
          onClick={e => {
            e.stopPropagation();
            if (onFavoriteToggle) onFavoriteToggle(id, !!isFavorite);
          }}
          disabled={disabled}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        {category && (
          <Chip
            label={category}
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              left: 10,
              top: 10,
              fontWeight: 600,
              fontSize: 13,
              px: 1.2,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}
      </Box>
      <Box sx={{ p: 1.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{
            fontWeight: 600,
            fontSize: 15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            mb: 0.5,
            cursor: 'pointer',
            lineHeight: 1.2,
            color: 'text.primary',
            transition: 'color 0.18s',
            '&:hover': {
              color: '#e53935', // Avito-rot
              textDecoration: 'underline',
            },
          }}
          onClick={onClick}
        >
          {title}
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 18,
              color: 'success.main',
              mr: 1,
              lineHeight: 1.2,
              userSelect: 'all', // kopierbar
            }}
          >
            {typeof price === 'number'
              ? price.toLocaleString('de-DE') + ' €'
              : (typeof price === 'string' && price)
                ? price
                : 'Preis auf Anfrage'}
          </Typography>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 'auto', color: 'text.secondary' }}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleMenuClose}>Nicht interessiert</MenuItem>
            <MenuItem onClick={handleMenuClose}>Falsche Kategorie</MenuItem>
            <MenuItem onClick={handleMenuClose}>Falscher Ort</MenuItem>
            <MenuItem onClick={handleMenuClose}>Anderes Problem</MenuItem>
          </Menu>
        </Box>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 'auto' }}>
          <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              fontSize: 13,
              color: 'text.secondary',
              lineHeight: 1.2,
              userSelect: 'all', // kopierbar
            }}
          >
            {location}
          </Typography>
          {condition && (
            <Chip
              label={condition}
              size="small"
              sx={{ 
                ml: 1, 
                fontSize: 12, 
                height: 20,
                bgcolor: 'background.default',
                color: 'text.secondary',
                fontWeight: 500,
              }}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default AvitoListingItem; 
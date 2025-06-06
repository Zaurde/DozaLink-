import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  Container,
  Snackbar,
  Avatar
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MessageIcon from '@mui/icons-material/Message';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NoImageIcon from '@mui/icons-material/Image';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { adService } from '../services/adService';
import type { Ad } from '../services/adService';
import { chatService } from '../services/chatService';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    const loadAd = async () => {
      if (!id) return;
      try {
        const adData = await adService.getAdById(id);
        if (!adData) {
          setError('Anzeige nicht gefunden');
          return;
        }
        setAd(adData);
      } catch (err) {
        console.error('Error loading ad:', err);
        setError('Fehler beim Laden der Anzeige');
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      setSnackbar('Bitte melde dich an, um Favoriten zu speichern');
      return;
    }
    if (!ad?.id) return;

    try {
      await toggleFavorite(ad.id);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setSnackbar('Fehler beim Speichern des Favoriten');
    }
  };

  const handleSendMessage = async () => {
    if (!user || !ad) return;
    setSendingMessage(true);
    try {
      await chatService.sendMessage({
        senderId: user.id,
        receiverId: ad.userId,
        listingId: ad.id!,
        content: message
      });
      setMessageDialogOpen(false);
      setMessage('');
      setSnackbar('Nachricht gesendet');
    } catch (err) {
      console.error('Error sending message:', err);
      setSnackbar('Fehler beim Senden der Nachricht');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
  );
  }

  if (error || !ad) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error || 'Anzeige nicht gefunden'}</Typography>
      </Container>
  );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Zurück
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 2 }}>
              {ad.images && ad.images.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={0}
                  slidesPerView={1}
                >
                  {ad.images.map((image, index) => (
                    <SwiperSlide key={index}>
              <Box
                component="img"
                        src={image}
                        alt={`${ad.title} - Bild ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 400,
                          objectFit: 'contain'
                        }}
              />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Box
                  sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100'
                  }}
                >
                  <NoImageIcon sx={{ fontSize: 100, color: 'grey.400' }} />
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {ad.title}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                {formatPrice(ad.price)}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  icon={<LocationOnIcon />}
                  label={ad.location}
                  variant="outlined"
                />
                <Chip
                  icon={<ImageIcon />}
                  label={`${ad.images?.length || 0} Bilder`}
                  variant="outlined"
                />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {ad.description}
              </Typography>
          </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
              <Button 
                  variant="contained"
                  color="primary"
                  startIcon={<MessageIcon />}
                  onClick={() => setMessageDialogOpen(true)}
                  disabled={!user || user.id === ad.userId}
              >
                Nachricht senden
              </Button>
                <Button
                  variant="outlined"
                  color={isFavorite(ad.id!) ? 'secondary' : 'primary'}
                  startIcon={isFavorite(ad.id!) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleToggleFavorite}
                >
                  {isFavorite(ad.id!) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                </Button>
                {user && user.id === ad.userId && (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/edit/${ad.id}`)}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        // TODO: Implement delete functionality
                        setSnackbar('Löschen noch nicht implementiert');
                      }}
                    >
                      Löschen
                    </Button>
                  </>
                )}
            </Stack>
          </Paper>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nachricht senden</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nachricht"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sendingMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)} disabled={sendingMessage}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!message.trim() || sendingMessage}
          >
            {sendingMessage ? <CircularProgress size={24} /> : 'Senden'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Container>
  );
}; 

export default ListingDetail; 
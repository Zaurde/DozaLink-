import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Stack, Paper, IconButton, InputAdornment
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { adService } from '../services/adService';
import { getAuth } from "firebase/auth";

const categories = [
  'Auto',
  'Elektronik',
  'Haus & Garten',
  'Mode & Beauty',
  'Familie, Kind & Baby',
  'Haustiere',
  'Heimwerken',
  'Immobilien',
  'Weitere Kategorien'
];

export const ListingForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          if (ev.target?.result) {
            setImagePreviews(prev => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!title || !description || !price || !category || !location) {
      setError('Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    setLoading(true);
    try {
      console.log("Firebase currentUser:", getAuth().currentUser);
      // Bilder in Storage hochladen
      const imageUrls: string[] = [];
      for (const file of images) {
        const url = await adService.uploadImage(file);
        imageUrls.push(url);
      }
      const newAd = {
        title,
        description,
        price: parseFloat(price),
        category,
        location,
        images: imageUrls,
        userId: user!.id
      };
      const id = await adService.createAd(newAd);
      setSuccess(true);
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setLocation('');
      setImages([]);
      setImagePreviews([]);
      if (onSuccess) onSuccess();
      setTimeout(() => navigate(`/listing/${id}`), 800);
    } catch (err) {
      console.error(err);
      setError('Fehler beim Speichern.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Paper sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '100%', md: 500 },
        mx: { xs: 0, sm: 0, md: 'auto' },
        p: 3, mt: 4, textAlign: 'center',
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Bitte einloggen, um eine Anzeige aufzugeben.</Typography>
        <Button variant="contained" color="primary" href="/login" startIcon={<AccountCircleIcon />}>Einloggen</Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{
      width: '100%',
      maxWidth: { xs: '100%', sm: '100%', md: 500 },
      mx: { xs: 0, sm: 0, md: 'auto' },
      p: 3, mt: 4, textAlign: 'center',
    }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Anzeige aufgeben</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Titel"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Beschreibung"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            fullWidth
            multiline
            minRows={3}
          />
          <TextField
            label="Preis (€)"
            value={price}
            onChange={e => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
            required
            fullWidth
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>
            }}
          />
          <TextField
            label="Kategorie"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            select
            fullWidth
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Standort"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
            fullWidth
          />
          {/* Bilder-Upload */}
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              sx={{ mb: 1 }}
            >
              Bilder hochladen
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageChange}
              />
            </Button>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {imagePreviews.map((img, idx) => (
                <Box key={idx} sx={{ position: 'relative' }}>
                  <img src={img} alt="Vorschau" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  <IconButton size="small" onClick={() => handleRemoveImage(idx)} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#fff' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">Anzeige erfolgreich aufgegeben!</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
          >
            Anzeige aufgeben
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}; 
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Stack, Paper, IconButton, InputAdornment, Select, InputLabel, FormControl
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import { adService } from '../services/adService';

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

const conditions = ['Neu', 'Wie neu', 'Gebraucht', 'Defekt'];

interface ListingEditFormProps {
  id?: string;
}

export const ListingEditForm = ({ id }: ListingEditFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adService.getAdById(id)
      .then(ad => {
        if (!ad) {
          setError('Anzeige nicht gefunden.');
          return;
        }
        setTitle(ad.title || '');
        setDescription(ad.description || '');
        setPrice(ad.price ? String(ad.price) : '');
        setCategory(ad.category || '');
        setLocation(ad.location || '');
        setCondition((ad as any).condition || '');
        setImages(ad.images || []);
        setError(null);
      })
      .catch(() => setError('Anzeige nicht gefunden.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          if (ev.target?.result) {
            setNewImagePreviews(prev => [...prev, ev.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };
  const handleRemoveNewImage = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!title || !description || !price || !category || !location || !condition) {
      setError('Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    setLoading(true);
    try {
      // Neue Bilder in Storage hochladen
      const uploadedImageUrls: string[] = [];
      for (const file of newImages) {
        const url = await adService.uploadImage(file);
        uploadedImageUrls.push(url);
      }
      // Kombiniere alte und neue Bilder
      const allImages = [...images, ...uploadedImageUrls];
      await adService.updateAd(id!, {
        title,
        description,
        price: parseFloat(price),
        category,
        location,
        condition,
        images: allImages
      });
      setSuccess(true);
      setTimeout(() => navigate(`/listing/${id}`), 800);
    } catch (err) {
      setError('Fehler beim Speichern.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Möchtest du diese Anzeige wirklich löschen?')) return;
    try {
      await adService.deleteAd(id!);
      navigate('/');
    } catch {
      setError('Fehler beim Löschen.');
    }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}>Lade Anzeige...</Box>;
  if (error) return <Box sx={{ p: 4, color: 'red', textAlign: 'center' }}>{error}</Box>;

  return (
    <Paper sx={{
      width: '100%',
      maxWidth: { xs: '100%', sm: '100%', md: 500 },
      mx: { xs: 0, sm: 0, md: 'auto' },
      p: 3, mt: 4,
    }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Anzeige bearbeiten</Typography>
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
          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel>Kategorie</InputLabel>
            <Select
              value={category}
              label="Kategorie"
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Standort"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
            fullWidth
          />
          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel>Zustand</InputLabel>
            <Select
              value={condition}
              label="Zustand"
              onChange={e => setCondition(e.target.value)}
            >
              {conditions.map(cond => (
                <MenuItem key={cond} value={cond}>{cond}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Bilder-Upload */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Bilder</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
              {images.map((img, idx) => (
                <Box key={idx} sx={{ position: 'relative' }}>
                  <img src={img} alt="Vorschau" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  <IconButton size="small" onClick={() => handleRemoveImage(idx)} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#fff' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              {newImagePreviews.map((img, idx) => (
                <Box key={images.length + idx} sx={{ position: 'relative' }}>
                  <img src={img} alt="Vorschau" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  <IconButton size="small" onClick={() => handleRemoveNewImage(idx)} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#fff' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
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
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">Anzeige erfolgreich gespeichert!</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
          >
            Anzeige speichern
          </Button>
          <Button variant="outlined" color="error" fullWidth onClick={handleDelete}>
            Anzeige löschen
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}; 
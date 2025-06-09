import { useState, useRef } from 'react';
import { Box, TextField, Button, Stack, Typography, MenuItem, Alert, IconButton, LinearProgress } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { adService } from '../services/adService';
import { useAuth } from '../context/AuthContext';

const categories = [
  'Auto', 'Elektronik', 'Haus & Garten', 'Mode & Beauty', 'Familie, Kind & Baby', 'Haustiere', 'Heimwerken', 'Immobilien', 'Weitere Kategorien'
];
const conditions = ['Neu', 'Wie neu', 'Gebraucht', 'Defekt'];
const MAX_IMAGES = 6;

export function ListingForm() {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const dropRef = useRef<HTMLDivElement>(null);

  // Drag & Drop Handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
    if (dropRef.current) dropRef.current.style.border = '2px dashed #ccc';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) dropRef.current.style.border = '2px dashed #1976d2';
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropRef.current) dropRef.current.style.border = '2px dashed #ccc';
  };

  const handleFiles = (files: File[]) => {
    const allowed = Math.max(0, MAX_IMAGES - images.length);
    const toAdd = files.slice(0, allowed);
    if (toAdd.length < files.length) {
      setError(`Maximal ${MAX_IMAGES} Bilder erlaubt.`);
    }
    setImages(prev => [...prev, ...toAdd]);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) setImagePreviews(prev => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(Array.from(e.target.files));
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setPrice(''); setCategory(''); setLocation(''); setCondition(''); setImages([]); setImagePreviews([]); setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log('Login wurde ausgelöst!');
    setSuccess(false);
    if (!title || !description || !price || !category || !location || !condition) {
      setError('Bitte fülle alle Pflichtfelder aus.');
      setLoading(false);
      return;
    }
    if (images.length === 0) {
      setError('Bitte lade mindestens ein Bild hoch.');
      setLoading(false);
      return;
    }
    if (!token) {
      setError('Du musst eingeloggt sein, um eine Anzeige zu erstellen.');
      setLoading(false);
      return;
    }
    setUploadProgress(0);
    try {
      // Bilder hochladen
      const urls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const url = await adService.uploadImage(images[i]);
        urls.push(url);
        setUploadProgress(Math.round(((i + 1) / images.length) * 100));
      }
      // Anzeige erstellen
      await adService.createAd({
        title,
        description,
        price: parseFloat(price),
        category,
        location,
        condition,
        images: urls,
        userId: '', // Backend sollte userId aus Token nehmen
      }, token);
      setSuccess(true);
      resetForm();
    } catch (err) {
      setError('Fehler beim Erstellen der Anzeige.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Neue Anzeige erstellen</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Anzeige erfolgreich erstellt!</Alert>}
        <TextField label="Titel" value={title} onChange={e => setTitle(e.target.value)} required fullWidth />
        <TextField label="Beschreibung" value={description} onChange={e => setDescription(e.target.value)} required fullWidth multiline minRows={3} />
        <TextField label="Preis (€)" value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9.]/g, ''))} required fullWidth type="number" />
        <TextField select label="Kategorie" value={category} onChange={e => setCategory(e.target.value)} required fullWidth>
          {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
        </TextField>
        <TextField label="Standort" value={location} onChange={e => setLocation(e.target.value)} required fullWidth />
        <TextField select label="Zustand" value={condition} onChange={e => setCondition(e.target.value)} required fullWidth>
          {conditions.map(cond => <MenuItem key={cond} value={cond}>{cond}</MenuItem>)}
        </TextField>
        {/* Drag & Drop Bilder-Upload */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Bilder (max. {MAX_IMAGES})</Typography>
          <Box
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 2,
              mb: 2,
              textAlign: 'center',
              bgcolor: '#fafafa',
              cursor: 'pointer',
              transition: 'border 0.2s',
            }}
          >
            <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Ziehe Bilder hierher oder klicke zum Hochladen
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              id="image-upload"
              onChange={handleImageChange}
              disabled={images.length >= MAX_IMAGES}
            />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span" sx={{ mt: 1 }} disabled={images.length >= MAX_IMAGES}>
                Bilder auswählen
              </Button>
            </label>
            {images.length >= MAX_IMAGES && (
              <Typography color="error" variant="caption">Maximal {MAX_IMAGES} Bilder erlaubt.</Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
            {imagePreviews.map((img, idx) => (
              <Box key={idx} sx={{ position: 'relative' }}>
                <img src={img} alt="Vorschau" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                <IconButton size="small" onClick={() => handleRemoveImage(idx)} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#fff' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
          {loading && uploadProgress > 0 && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption">Bilder werden hochgeladen... ({uploadProgress}%)</Typography>
            </Box>
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary" size="large" disabled={loading || !token}>
          Anzeige speichern
        </Button>
      </Stack>
    </Box>
  );
} 
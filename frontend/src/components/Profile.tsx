import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  Avatar,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { adService } from '../services/adService';

export function Profile() {
  const { user, token, updateUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(user?.profileImage || null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setProfileImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setProfileImagePreview(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Wenn ein neues Profilbild ausgewählt wurde, lade es hoch
      let profileImageUrl = user?.profileImage;
      if (profileImage) {
        profileImageUrl = await adService.uploadImage(profileImage);
      }

      // Aktualisiere Profil
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          profileImage: profileImageUrl
        })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Profils');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setSuccess(true);
      showSnackbar('Profil erfolgreich aktualisiert', 'success');
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Ändern des Passworts');
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showSnackbar('Passwort erfolgreich geändert', 'success');
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h5" gutterBottom>
            Profil bearbeiten
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Änderungen erfolgreich gespeichert!</Alert>}

          {/* Profilbild */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={profileImagePreview || undefined}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-image-upload"
              type="file"
              onChange={handleProfileImageChange}
            />
            <label htmlFor="profile-image-upload">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          {/* Profil-Formular */}
          <Box component="form" onSubmit={handleUpdateProfile}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="E-Mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                Profil aktualisieren
              </Button>
            </Stack>
          </Box>

          <Divider />

          {/* Passwort-Formular */}
          <Box component="form" onSubmit={handleUpdatePassword}>
            <Stack spacing={2}>
              <Typography variant="h6">Passwort ändern</Typography>
              <TextField
                label="Aktuelles Passwort"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Neues Passwort"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Neues Passwort bestätigen"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                Passwort ändern
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
} 
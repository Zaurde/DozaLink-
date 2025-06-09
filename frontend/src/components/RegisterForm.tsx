import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Link,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { register } from "../services/api";

export default function RegisterForm() {
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      setLoading(false);
      return;
    }

    try {
      await register(email, password);
      // Automatically login after successful registration
      await login(email, password);
      showSnackbar('Registrierung erfolgreich! Du wurdest automatisch eingeloggt.', 'success');
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        autoComplete="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!error}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="E-Mail Adresse"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!error}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Passwort"
        type="password"
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!error}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Passwort bestätigen"
        type="password"
        id="confirmPassword"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!!error}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5 }}
        disabled={loading}
      >
        {loading ? 'Wird registriert...' : 'Registrieren'}
      </Button>
      <Box sx={{ textAlign: 'center' }}>
        <Link component={RouterLink} to="/login" variant="body2">
          Bereits ein Konto? Jetzt anmelden
        </Link>
      </Box>
    </Box>
  );
} 
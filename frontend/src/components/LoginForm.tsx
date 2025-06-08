import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Link,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { login } from "../services/api";

export const LoginForm = () => {
  const { login: doLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await doLogin(email, password);
      showSnackbar('Erfolgreich eingeloggt!', 'success');
      navigate('/');
    } catch (err: any) {
      setError(err.message || "Login fehlgeschlagen");
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
        id="email"
        label="E-Mail Adresse"
        name="email"
        autoComplete="email"
        autoFocus
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
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!error}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5 }}
        disabled={loading}
      >
        {loading ? 'Wird angemeldet...' : 'Anmelden'}
      </Button>
      <Box sx={{ textAlign: 'center' }}>
        <Link component={RouterLink} to="/register" variant="body2">
          Noch kein Konto? Jetzt registrieren
        </Link>
      </Box>
    </Box>
  );
}; 
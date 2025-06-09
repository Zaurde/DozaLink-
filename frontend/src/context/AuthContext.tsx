import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const payload = parseJwt(storedToken);
      if (payload && payload.sub) {
        // Fetch user details from backend
        fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        })
        .then(res => res.json())
        .then(userData => setUser(userData))
        .catch(() => {
          // If fetch fails, clear invalid token
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        });
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });
    if (!res.ok) throw new Error('Login fehlgeschlagen');
    const data = await res.json();
    if (!data.access_token) throw new Error('Kein Token erhalten');
    
    // Fetch user details after successful login
    const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${data.access_token}`
      }
    });
    if (!userRes.ok) throw new Error('Fehler beim Laden der Benutzerdaten');
    const userData = await userRes.json();
    
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 
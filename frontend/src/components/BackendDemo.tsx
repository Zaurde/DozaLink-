import React, { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;

const BackendDemo: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/demo`)
      .then(res => {
        if (!res.ok) throw new Error('Fehler beim Laden der Backend-Demo');
        return res.json();
      })
      .then(data => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Lade Backend-Demo...</div>;
  if (error) return <div>Fehler: {error}</div>;
  return <div>Backend-Antwort: {message}</div>;
};

export default BackendDemo; 
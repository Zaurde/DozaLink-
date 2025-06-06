const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Beispiel-Route
app.get('/api/demo', (req, res) => {
  res.json({ message: 'Demo-Daten, keine echten Nutzerdaten!' });
});

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
}); 
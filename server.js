const express = require('express');
const cors = require('cors');
const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration lowdb avec l'ancienne syntaxe (v3)
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDb() {
  await db.read();
  db.data ||= { actualites: [], dons: [], nextId: 1 };
  await db.write();
}
initDb();

// ---------- API Actualités ----------
app.get('/api/actualites', async (req, res) => {
  await db.read();
  res.json(db.data.actualites);
});

app.post('/api/actualites', async (req, res) => {
  await db.read();
  const { titre, contenu, date } = req.body;
  if (!titre || !contenu) return res.status(400).json({ error: 'Titre et contenu requis' });
  const newActu = {
    id: db.data.nextId++,
    titre,
    contenu,
    date: date || new Date().toISOString().slice(0,10)
  };
  db.data.actualites.push(newActu);
  await db.write();
  res.status(201).json(newActu);
});

app.put('/api/actualites/:id', async (req, res) => {
  await db.read();
  const id = parseInt(req.params.id);
  const index = db.data.actualites.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Non trouvé' });
  const { titre, contenu, date } = req.body;
  if (titre) db.data.actualites[index].titre = titre;
  if (contenu) db.data.actualites[index].contenu = contenu;
  if (date) db.data.actualites[index].date = date;
  await db.write();
  res.json(db.data.actualites[index]);
});

app.delete('/api/actualites/:id', async (req, res) => {
  await db.read();
  const id = parseInt(req.params.id);
  db.data.actualites = db.data.actualites.filter(a => a.id !== id);
  await db.write();
  res.json({ success: true });
});

// ---------- API Dons ----------
app.post('/api/dons', async (req, res) => {
  await db.read();
  const { nom, email, montant, message } = req.body;
  if (!nom || !email || !montant) return res.status(400).json({ error: 'Champs requis' });
  const don = {
    id: db.data.nextId++,
    nom,
    email,
    montant,
    message: message || '',
    date: new Date().toISOString()
  };
  db.data.dons.push(don);
  await db.write();
  res.status(201).json({ success: true, message: 'Misaotra betsaka ! Merci pour votre soutien.' });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur FCRTM lancé sur http://localhost:${PORT}`);
});
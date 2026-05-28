# FCRTM Madagascar – Site officiel

Site web de la Fédération des Communautés Royales Traditionnelles et Culturelles de Madagascar.  
Présentation de l’histoire, des activités, des 44 *Lika Lily*, et formulaire de dons.

## 🚀 Déploiement

### 1. Sur Render (recommandé, backend compris)
- Créez un compte sur [render.com](https://render.com)
- Nouveau Web Service → Connectez votre dépôt GitHub
- **Build Command** : `npm install`
- **Start Command** : `node server.js`
- Ajoutez une variable d’environnement si besoin (PORT défini automatiquement)

### 2. Sur Railway
- `npm install` puis `npm start` (même principe)

### 3. En local
```bash
npm install
node server.js
# Ouvrir http://localhost:3000
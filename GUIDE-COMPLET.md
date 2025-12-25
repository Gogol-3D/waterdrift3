# 🚀 GUIDE COMPLET - DÉPLOIEMENT WATER RACER

## 📦 FICHIERS FOURNIS

Tu as reçu **water-racer-github.zip** qui contient TOUS les fichiers nécessaires :

```
water-racer-github/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions (optionnel)
├── src/
│   ├── App.jsx                 # Le jeu complet ✅
│   ├── main.jsx                # Point d'entrée React ✅
│   └── index.css               # Styles de base ✅
├── .gitignore                  # Fichiers à ignorer ✅
├── index.html                  # Page HTML ✅
├── netlify.toml                # Config Netlify ✅
├── package.json                # Dépendances ✅
├── README.md                   # Documentation ✅
└── vite.config.js              # Config Vite ✅
```

---

## ✅ ÉTAPE 1 : TÉLÉCHARGER ET DÉCOMPRESSER

1. **Télécharge** `water-racer-github.zip`
2. **Décompresse** l'archive
3. Tu obtiens le dossier `water-racer-github/`

---

## ✅ ÉTAPE 2 : TESTER EN LOCAL (IMPORTANT !)

Avant de mettre sur GitHub, teste que ça marche sur ton ordinateur :

```bash
# Entre dans le dossier
cd water-racer-github

# Installe les dépendances
npm install

# Lance le serveur de développement
npm run dev
```

**Tu devrais voir** :
```
  VITE v4.3.9  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

**Ouvre** http://localhost:5173/ dans ton navigateur.

### ✅ Checklist de vérification locale :
- [ ] Le menu "WATER RACER" s'affiche
- [ ] Le canvas (zone de jeu) est visible
- [ ] Le bouton "Naviguer" fonctionne
- [ ] Le jeu démarre quand tu cliques
- [ ] Les contrôles répondent (flèches du clavier)

**Si tout fonctionne en local, passe à l'étape suivante !**

---

## ✅ ÉTAPE 3 : CRÉER UN NOUVEAU REPO GITHUB

### Option A : Via l'interface GitHub (RECOMMANDÉ)

1. Va sur https://github.com/new
2. **Nom du repository** : `water-racer` (ou ce que tu veux)
3. **Visibilité** : Public ou Private (ton choix)
4. **NE COCHE PAS** "Add a README file"
5. **NE COCHE PAS** "Add .gitignore"
6. Clique sur **"Create repository"**

### Option B : Via GitHub Desktop

1. Ouvre GitHub Desktop
2. File → New Repository
3. Name : `water-racer`
4. Create Repository

---

## ✅ ÉTAPE 4 : POUSSER LE CODE SUR GITHUB

Dans le terminal, dans le dossier `water-racer-github/` :

```bash
# Initialiser git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Water Racer game"

# Renommer la branche en main
git branch -M main

# Ajouter l'origine (REMPLACE TON_USERNAME par ton nom GitHub)
git remote add origin https://github.com/TON_USERNAME/water-racer.git

# Pousser sur GitHub
git push -u origin main
```

**Exemple concret** :
Si ton username GitHub est `johndoe`, la commande serait :
```bash
git remote add origin https://github.com/johndoe/water-racer.git
```

### Si Git demande tes identifiants :
- **Username** : Ton nom d'utilisateur GitHub
- **Password** : Utilise un **Personal Access Token** (pas ton mot de passe)
  - Génère un token sur : https://github.com/settings/tokens

---

## ✅ ÉTAPE 5 : VÉRIFIER SUR GITHUB

1. Va sur `https://github.com/TON_USERNAME/water-racer`
2. **Tu dois voir tous les fichiers** :
   - src/
   - package.json
   - index.html
   - etc.

**Vérifie particulièrement que** :
- Le fichier `src/App.jsx` est présent
- Il fait environ **31 Ko**
- Le fichier `package.json` est présent

---

## ✅ ÉTAPE 6 : DÉPLOYER SUR NETLIFY

### Méthode : Via l'interface Netlify

1. **Connecte-toi** sur https://app.netlify.com/
   - Utilise ton compte GitHub pour te connecter

2. **Nouveau site** :
   - Clique sur "Add new site" → "Import an existing project"

3. **Connecter GitHub** :
   - Clique sur "GitHub"
   - Autorise Netlify à accéder à tes repos
   - Sélectionne le repo `water-racer`

4. **Configuration du build** :
   - **Branch to deploy** : `main`
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - Clique sur "Deploy site"

5. **Attendre le déploiement** :
   - Ça prend 1-2 minutes
   - Tu verras un indicateur de progression

6. **Récupérer l'URL** :
   - Une fois terminé, tu auras une URL type : `https://random-name-123.netlify.app`
   - Clique dessus !

---

## ✅ ÉTAPE 7 : VÉRIFIER LE DÉPLOIEMENT

Ouvre l'URL Netlify dans ton navigateur :

### ✅ Checklist de vérification :
- [ ] Le canvas (zone de jeu) s'affiche
- [ ] Le menu "WATER RACER" est visible
- [ ] Le bouton "Naviguer" fonctionne
- [ ] Le jeu démarre
- [ ] Sur mobile : les boutons tactiles apparaissent

---

## 🐛 SI ÇA NE MARCHE PAS

### Problème 1 : Écran blanc sur Netlify

**Vérifie les logs de build** :
1. Va sur Netlify → Ton site → "Deploys"
2. Clique sur le dernier déploiement
3. Regarde les logs

**Erreurs courantes** :
- `Module not found` → Les fichiers ne sont pas tous sur GitHub
- `Build failed` → Vérifie que package.json est correct

**Solution** :
```bash
# Vérifie que TOUS les fichiers sont commités
git status

# Si des fichiers manquent
git add .
git commit -m "Add missing files"
git push
```

### Problème 2 : Canvas ne s'affiche pas

**Vide le cache du navigateur** :
- Chrome/Edge : `Ctrl + Shift + R` (PC) ou `Cmd + Shift + R` (Mac)
- Firefox : `Ctrl + F5`

**Vérifie la console** :
- Appuie sur `F12`
- Regarde l'onglet "Console"
- Regarde s'il y a des erreurs en rouge

### Problème 3 : Erreur "Failed to fetch"

**C'est un problème de cache Netlify** :
1. Va sur Netlify → Site settings → Build & deploy
2. Clique sur "Trigger deploy" → "Clear cache and deploy site"

### Problème 4 : Les fichiers manquent sur GitHub

**Vérifie que tu as bien poussé** :
```bash
git log
# Tu dois voir ton commit "Initial commit"

git remote -v
# Tu dois voir l'URL de ton repo GitHub
```

---

## 📱 TESTER SUR MOBILE

1. **Déploie sur Netlify** (étapes ci-dessus)
2. **Ouvre l'URL** sur ton smartphone
3. **Les boutons tactiles** doivent apparaître en bas
4. **Le canvas** doit s'adapter à l'écran

---

## 🔄 POUR METTRE À JOUR LE JEU

Si tu modifies le code plus tard :

```bash
# Après avoir modifié des fichiers
git add .
git commit -m "Description de tes changements"
git push

# Netlify redéploiera automatiquement !
```

---

## 📊 STRUCTURE DES FICHIERS - EXPLICATION

### Fichiers ESSENTIELS (ne jamais supprimer) :

- **package.json** : Liste des dépendances React, Vite, etc.
- **vite.config.js** : Configuration de Vite (build tool)
- **index.html** : Page HTML qui charge l'app React
- **src/main.jsx** : Point d'entrée qui démarre React
- **src/App.jsx** : **LE JEU COMPLET** (le plus important !)
- **src/index.css** : Styles de base

### Fichiers de CONFIGURATION :

- **.gitignore** : Dit à Git d'ignorer node_modules, dist, etc.
- **netlify.toml** : Dit à Netlify comment builder l'app
- **.github/workflows/deploy.yml** : GitHub Actions (optionnel)

### Fichiers GÉNÉRÉS (ne pas commiter) :

- **node_modules/** : Dépendances (installées avec `npm install`)
- **dist/** : Version buildée (générée avec `npm run build`)

---

## 💡 COMMANDES UTILES

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Créer une version de production
npm run build

# Prévisualiser la version de production
npm run preview

# Vérifier le statut Git
git status

# Voir l'historique des commits
git log

# Voir les branches
git branch
```

---

## 🎯 RÉSUMÉ RAPIDE

1. ✅ Décompresse `water-racer-github.zip`
2. ✅ Teste en local : `npm install` puis `npm run dev`
3. ✅ Crée un repo GitHub vide
4. ✅ Pousse le code :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TON_USERNAME/water-racer.git
   git push -u origin main
   ```
5. ✅ Va sur Netlify → Import from GitHub → Configure → Deploy
6. ✅ Ouvre l'URL Netlify → LE JEU MARCHE ! 🎉

---

## 🆘 BESOIN D'AIDE ?

Si ça ne marche toujours pas, envoie-moi :

1. **Capture d'écran** de la console (F12) dans le navigateur
2. **Capture d'écran** des logs Netlify
3. **URL** de ton repo GitHub
4. **Message d'erreur** exact que tu vois

---

## ✨ UNE FOIS QUE ÇA MARCHE

Tu peux :
- Personnaliser le nom du site sur Netlify (Site settings → Change site name)
- Ajouter un domaine personnalisé
- Partager le lien avec tes amis ! 🚤

**Bon jeu ! 🌊🎮**

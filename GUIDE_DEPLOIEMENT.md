# Haven Stays — Guide de Déploiement

## 1. Nom de Domaine

### Recommandation : havenstays.com + havenstays.ma

**Pourquoi les deux ?**
- `.com` → crédibilité internationale, SEO global, indispensable
- `.ma` → légitimité locale au Maroc, confiance des propriétaires marocains

**Où acheter :**

| Domaine | Registrar | Coût 1ère année | Renouvellement |
|---------|-----------|-----------------|----------------|
| havenstays.com | [Namecheap](https://namecheap.com) | ~$6.49 | ~$13/an |
| havenstays.ma | [Hostino](https://hostino.ma) | ~100 MAD | ~50 MAD/an |

**Étapes :**
1. Aller sur namecheap.com → chercher "havenstays.com"
2. Si disponible, acheter (activer WhoisGuard gratuit pour la privacy)
3. Aller sur hostino.ma → chercher "havenstays.ma"
4. Acheter avec une adresse administrative au Maroc

---

## 2. Hébergement Vercel (Gratuit)

### Pourquoi Vercel ?
- Gratuit pour les sites statiques
- CDN mondial (performances excellentes)
- SSL automatique (HTTPS)
- Déploiement en 2 minutes
- Preview pour chaque modification

### Étape par étape :

#### A. Créer un compte Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer "Sign Up" → avec GitHub, GitLab, ou email
3. Valider l'email

#### B. Préparer les fichiers
Le dossier du site est déjà prêt avec cette structure :
```
Conciergerie Marrakech/
├── index.html          ← Page d'accueil FR
├── services.html
├── a-propos.html
├── zones.html
├── tarifs.html
├── contact.html
├── estimation.html
├── blog.html
├── 404.html            ← Page d'erreur
├── robots.txt          ← Instructions moteurs de recherche
├── sitemap.xml         ← Plan du site
├── vercel.json         ← Config Vercel
├── en/                 ← Version anglaise
│   ├── index.html
│   ├── services.html
│   ├── about.html
│   ├── areas.html
│   ├── pricing.html
│   ├── contact.html
│   ├── estimate.html
│   └── blog.html
└── brand/              ← Kit identité visuelle
    ├── logo-dark.svg
    ├── logo-light.svg
    ├── logo-gold.svg
    ├── icon.svg
    ├── favicons/
    ├── social/
    └── ...
```

#### C. Option 1 : Déploiement via GitHub (Recommandé)

1. **Créer un repo GitHub :**
   - Aller sur github.com → New Repository
   - Nom : `haven-stays-website`
   - Public ou Private
   - Cliquer "Create"

2. **Uploader les fichiers :**
   - Cliquer "uploading an existing file"
   - Glisser-déposer TOUT le contenu du dossier `Conciergerie Marrakech/`
   - ⚠️ NE PAS inclure les fichiers `.docx`, `.pptx`, `.pdf` (garder uniquement les fichiers web)
   - Commit : "Initial website deployment"

3. **Connecter à Vercel :**
   - Aller sur vercel.com → "Add New Project"
   - Importer le repo `haven-stays-website`
   - Framework Preset : "Other"
   - Root Directory : `.` (racine)
   - Cliquer "Deploy"
   - ✅ Le site est en ligne en ~30 secondes !

#### D. Option 2 : Déploiement direct (Drag & Drop)

1. Aller sur vercel.com → Dashboard
2. Cliquer "Add New Project"
3. Tout en bas : "Or deploy a template or Import from a third-party Git repository"
4. Alternative : utiliser Vercel CLI (voir section suivante)

#### E. Option 3 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Dans le dossier du site
cd "Conciergerie Marrakech"

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

---

## 3. Connecter le Domaine

### Sur Vercel :
1. Dashboard → ton projet → "Settings" → "Domains"
2. Ajouter `havenstays.com`
3. Vercel te donne des DNS records à configurer

### Sur Namecheap :
1. Dashboard → Domain List → "Manage" sur havenstays.com
2. Nameservers → "Custom DNS"
3. Ajouter les nameservers Vercel :
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
4. Sauvegarder → attendre 24-48h pour la propagation DNS

### Pour havenstays.ma :
1. Même processus sur Hostino
2. Ajouter comme alias sur Vercel (redirection vers .com)

---

## 4. Post-Déploiement

### Vérifications :
- [ ] Site accessible sur havenstays.com
- [ ] HTTPS actif (cadenas vert)
- [ ] Pages FR et EN fonctionnelles
- [ ] Formulaires testés
- [ ] WhatsApp fonctionne
- [ ] 404 page fonctionne
- [ ] OG tags testés (partage sur Facebook/LinkedIn)
- [ ] Mobile responsive OK
- [ ] Google Maps sur la page contact

### Soumettre à Google :
1. Aller sur [Google Search Console](https://search.google.com/search-console)
2. Ajouter la propriété `havenstays.com`
3. Vérifier via DNS (Vercel ou Namecheap)
4. Soumettre le sitemap : `https://havenstays.com/sitemap.xml`

### Google Analytics (optionnel) :
1. Créer un compte [Google Analytics](https://analytics.google.com)
2. Créer une propriété GA4
3. Copier le code de suivi
4. Ajouter avant `</head>` sur chaque page

### WhatsApp Business :
- Remplacer `212600000000` par ton vrai numéro dans tous les fichiers
- Format : `212` + numéro sans le 0 (ex: `212612345678`)

---

## 5. Coûts Annuels Estimés

| Élément | Coût |
|---------|------|
| Hébergement Vercel | **Gratuit** |
| Domaine .com | ~$13/an (~130 MAD) |
| Domaine .ma | ~50 MAD/an |
| SSL | **Gratuit** (inclus Vercel) |
| CDN | **Gratuit** (inclus Vercel) |
| **TOTAL** | **~180 MAD/an** (~$18) |

---

## Support

Pour toute question technique : medini.hillal@gmail.com

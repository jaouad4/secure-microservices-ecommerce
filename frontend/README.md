# E-Commerce React Frontend

Application frontend React pour le système de gestion de produits et commandes basé sur une architecture microservices sécurisée.

## 🚀 Technologies

- **React 18** - Framework UI
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Styling
- **TanStack React Query** - Data fetching et cache
- **React Router DOM** - Navigation
- **Keycloak JS** - Authentification OAuth2/OpenID Connect
- **Axios** - Client HTTP
- **React Hook Form** - Gestion des formulaires
- **React Hot Toast** - Notifications

## 📋 Prérequis

- Node.js 18+
- Backend microservices en cours d'exécution
- Keycloak configuré avec le realm `ecommerce-realm`

## 🔧 Installation

1. **Cloner le repository et accéder au dossier frontend:**

```bash
cd frontend
```

2. **Installer les dépendances:**

```bash
npm install
```

3. **Configurer les variables d'environnement:**

Créer un fichier `.env` basé sur `.env.example`:

```env
VITE_API_GATEWAY_URL=http://localhost:8888
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=ecommerce-realm
VITE_KEYCLOAK_CLIENT_ID=ecommerce-client
```

4. **Démarrer l'application en mode développement:**

```bash
npm run dev
```

L'application sera disponible sur http://localhost:5173

## 🏗️ Structure du projet

```
src/
├── components/           # Composants réutilisables
│   ├── auth/            # Composants d'authentification
│   ├── common/          # Composants UI communs
│   ├── orders/          # Composants liés aux commandes
│   └── products/        # Composants liés aux produits
├── config/              # Configuration (Keycloak, API)
├── contexts/            # React Contexts (Auth, Cart)
├── hooks/               # Custom React Hooks
├── pages/               # Pages de l'application
│   ├── admin/           # Pages administration
│   └── client/          # Pages client
├── services/            # Services API
└── utils/               # Utilitaires
```

## 👥 Rôles et Permissions

### CLIENT
- Consulter le catalogue de produits
- Ajouter des produits au panier
- Passer des commandes
- Consulter l'historique de ses commandes

### ADMIN
- Toutes les permissions CLIENT
- Tableau de bord avec statistiques
- Gestion des produits (CRUD)
- Gestion de toutes les commandes

## 🛣️ Routes

### Routes publiques
- `/` - Page d'accueil
- `/login` - Page de connexion

### Routes CLIENT (authentification requise)
- `/catalog` - Catalogue des produits
- `/catalog/:id` - Détail d'un produit
- `/cart` - Panier
- `/checkout` - Validation de commande
- `/my-orders` - Historique des commandes

### Routes ADMIN
- `/admin` - Dashboard admin
- `/admin/products` - Gestion des produits
- `/admin/orders` - Gestion des commandes

## 🔐 Authentification

L'application utilise **Keycloak** pour l'authentification OAuth2/OpenID Connect:

- **Flow**: Authorization Code avec PKCE
- **Tokens**: JWT stockés en mémoire (refresh automatique)
- **Rôles**: Extraits du token via `realm_access.roles`

## 🌐 Communication API

Toutes les requêtes passent par l'**API Gateway** (port 8888):

- **Product Service**: `/PRODUCT-SERVICE/api/products`
- **Order Service**: `/ORDER-SERVICE/api/orders`

Les tokens JWT sont automatiquement ajoutés aux en-têtes `Authorization`.

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint
```

## 🐳 Docker

### Build de l'image

```bash
docker build -t ecommerce-frontend .
```

### Exécution

```bash
docker run -p 80:80 ecommerce-frontend
```

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_API_GATEWAY_URL` | URL de l'API Gateway | `http://localhost:8888` |
| `VITE_KEYCLOAK_URL` | URL du serveur Keycloak | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | Nom du realm Keycloak | `ecommerce-realm` |
| `VITE_KEYCLOAK_CLIENT_ID` | Client ID Keycloak | `ecommerce-client` |

## 🧪 Gestion des erreurs

L'application gère automatiquement:

- **401 Unauthorized**: Redirection vers login, refresh token tenté
- **403 Forbidden**: Message d'erreur "accès refusé"
- **404 Not Found**: Page 404
- **500 Server Error**: Message d'erreur générique

## 📱 Responsive Design

L'interface est entièrement responsive grâce à Tailwind CSS:

- Mobile first
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Navigation adaptative

## 🎨 Personnalisation

### Thème

Modifier `tailwind.config.js` pour personnaliser:

- Couleurs primaires/secondaires
- Police de caractères
- Espacements
- Animations

## 📝 License

MIT

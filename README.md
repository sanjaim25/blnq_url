# Blnq — Links, Elevated.

<div align="center">

**A professional, high-performance URL shortener and link management platform.**

Blnq combines a stunning, modern UI with a powerful backend to give you full control over your links — from creation to deep analytics.

🔗 **Live:** [https://blnq.vercel.app](https://blnq.vercel.app/)

</div>

---

## ✨ Features

### Core Link Management
- **Instant URL Shortening** — Paste a URL, get a short link in milliseconds.
- **Custom Aliases** — Choose memorable short codes (e.g., `blnq.vercel.app/my-brand`).
- **Bulk Shortening** — Shorten up to 1,000 URLs at once via CSV upload or manual entry; results organized into named batches.
- **Link Editing** — Update the destination URL, tags, expiry, or password of any existing link.

### Security & Access Control
- **Password-Protected Links** — Lock any short link behind a password with a branded unlock page.
- **Link Expiration** — Set auto-expiry dates; expired links show a clean "Link Expired" page.
- **JWT Authentication** — Stateless, secure session management with 8-hour token expiry.
- **Google OAuth 2.0** — One-click sign-in with Google Identity Services, with automatic account linking for existing email users.

### Smart Routing
- **Device-Based Routing** — Redirect mobile, tablet, and desktop users to different destinations from a single short link.
- **Geo Routing** — Route visitors to region-specific URLs based on their country.

### Analytics & Insights
- **Real-Time Dashboard** — Live click counts, active/expired link stats, and daily trends over the last 30 days.
- **Per-Link Analytics** — 7-day click timeline, visitor breakdowns, and recent visit log per individual link.
- **Visitor Intelligence** — Country, device, browser, and referrer breakdowns with visual charts.
- **Top Links Leaderboard** — See your top 5 most-clicked links at a glance.
- **Recent Activity Feed** — Live stream of the latest 10 visits across all your links.

### QR Codes
- **Instant QR Generation** — Generate downloadable QR codes for any short link with customizable configuration.

### Productivity
- **Command Palette** — `Ctrl + K` / `⌘ K` quick-access command palette for fast navigation.
- **PDF Export** — Export your link data and analytics reports to PDF.
- **Batch Management** — View, inspect, and delete bulk-shortened link batches.
- **Tags** — Organize links with custom tags for easy filtering.

### Pages & Resources
- **Landing Page** — Premium animated landing page with feature showcases.
- **Features Hub** — Dedicated pages for Link Shortening, Custom Aliases, QR Codes, Link Expiry, Smart Routing, and Analytics.
- **About, Contact, Help Desk** — Full informational pages.
- **Legal** — Terms of Service and Privacy Policy pages.
- **Pricing** — Pricing plans page.
- **User Profile** — Update display name and manage account settings.

---

## 🏗️ Architecture

Blnq uses a fully decoupled, modern architecture optimized for performance and scalability.

```mermaid
graph TD
    User((User)) -->|HTTPS| Client

    subgraph Frontend
        Client["React 18 + Vite 5\nTailwind CSS + Framer Motion\nRecharts + Lucide Icons\nDeployed on Vercel"]
    end

    subgraph Backend
        Server["Node.js + Express 4\nHelmet + Rate Limiting\nJWT + Google OAuth\nDeployed on Render"]
    end

    subgraph Database
        DB[("PostgreSQL\nHosted on Neon\nManaged via Prisma ORM")]
    end

    Client -->|REST API| Server
    Server -->|Prisma Queries| DB
```

### Database Schema

The Prisma-managed PostgreSQL database includes the following models:

| Model | Purpose |
|---|---|
| **User** | Accounts with email/password or Google OAuth |
| **Url** | Shortened links with metadata, tags, passwords, geo/device routing, QR config |
| **Visit** | Click analytics — country, device, browser, referrer, timestamp |
| **Batch** | Groups of bulk-shortened URLs with success/fail counts |
| **Workspace** | Organizational container for links, campaigns, and domains |
| **Campaign** | UTM-tagged marketing campaigns linked to workspaces |
| **Domain** | Custom domains linked to workspaces |
| **LinkInBio** | Link-in-bio profile pages with themes and social links |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with lazy-loaded routes and Error Boundaries |
| **Vite 5** | Lightning-fast dev server and build tool |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Animations and micro-interactions |
| **Recharts** | Analytics charts and data visualization |
| **Lucide React** | Premium iconography |
| **Axios** | HTTP client for API communication |
| **React Router v6** | Client-side routing with protected routes |
| **React Hot Toast** | Notification system |
| **jsPDF + AutoTable** | PDF export for reports |
| **qrcode.react** | QR code generation |
| **React Confetti** | Celebratory UI effects |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express 4** | REST API framework |
| **Prisma ORM** | Type-safe database queries and migrations |
| **PostgreSQL** (Neon) | Relational database |
| **JSON Web Tokens** | Stateless authentication |
| **Google Auth Library** | Google OAuth 2.0 integration |
| **bcryptjs** | Password hashing |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | DDoS and brute-force protection |
| **express-validator** | Input validation and sanitization |
| **nanoid** | Collision-resistant short code generation |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn**
- A **PostgreSQL** database URL (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), or local)
- A **Google Cloud OAuth 2.0 Client ID** (for Google sign-in)

### 1. Clone the Repository
```bash
git clone https://github.com/sanjaim25/blnq_url.git
cd blnq_url
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key"
CLIENT_URL="http://localhost:5173"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

Push the database schema and start the server:
```bash
npx prisma db push
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL="http://localhost:5000"
VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

Start the frontend:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 📁 Project Structure

```
blnq_url/
├── client/                    # React frontend
│   └── src/
│       ├── api/               # Axios API client
│       ├── components/        # Shared UI components
│       │   ├── animations/    # SVG & motion animations
│       │   ├── effects/       # Visual effects
│       │   ├── Navbar.jsx     # Responsive navigation bar
│       │   ├── Footer.jsx     # Site footer
│       │   ├── QRModal.jsx    # QR code generation modal
│       │   ├── CommandPalette.jsx  # Ctrl+K command palette
│       │   ├── ProtectedRoute.jsx  # Auth route guard
│       │   └── Logo.jsx       # Brand logo component
│       ├── context/           # React Context (AuthContext)
│       ├── hooks/             # Custom React hooks
│       ├── pages/             # Route-level page components
│       │   ├── Dashboard.jsx  # Main link management hub
│       │   ├── Shorten.jsx    # Single URL shortening
│       │   ├── BulkShorten.jsx # Bulk CSV/manual shortening
│       │   ├── Analytics.jsx  # Analytics dashboard
│       │   ├── Profile.jsx    # User profile settings
│       │   ├── Landing.jsx    # Public landing page
│       │   ├── Login.jsx      # Email + Google login
│       │   ├── Signup.jsx     # Email + Google signup
│       │   └── features/      # Feature showcase pages
│       ├── App.jsx            # Root component with routing
│       ├── main.jsx           # Entry point
│       └── index.css          # Global styles
│
├── server/                    # Express backend
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema (8 models)
│   │   └── migrations/        # Prisma migration history
│   └── src/
│       ├── index.js           # Server entry, CORS, redirect engine
│       ├── routes/
│       │   ├── auth.js        # Signup, Login, Google OAuth, Profile
│       │   ├── urls.js        # CRUD, Bulk, Batch management
│       │   └── analytics.js   # Overview & per-link analytics
│       ├── middleware/
│       │   └── auth.js        # JWT authentication middleware
│       └── utils/
│           └── generateCode.js  # nanoid short code generator
│
└── README.md
```

---

## 🔒 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register with email & password |
| `POST` | `/api/auth/login` | Login with email & password |
| `POST` | `/api/auth/google` | Google OAuth sign-in |
| `PUT` | `/api/auth/profile` | Update user profile |

### URL Management
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/urls` | Shorten a URL (supports custom alias, password, expiry, tags, routing) |
| `GET` | `/api/urls` | List all user's individual URLs |
| `PATCH` | `/api/urls/:id` | Update a URL |
| `DELETE` | `/api/urls/:id` | Delete a URL |
| `POST` | `/api/urls/bulk` | Bulk shorten up to 1,000 URLs |
| `GET` | `/api/urls/batches` | List all batches |
| `GET` | `/api/urls/batches/:id` | Get batch details with URLs |
| `DELETE` | `/api/urls/batches/:id` | Delete a batch and its URLs |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/overview` | Account-wide analytics (30-day trends, breakdowns) |
| `GET` | `/api/analytics/:id` | Per-link analytics (7-day trends, visitors) |

### Redirects
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/:code` | Redirect to original URL (with device/geo routing) |
| `POST` | `/:code` | Password-protected redirect |

---

## 🔐 Security

- **Helmet** — Sets secure HTTP headers to prevent common attacks.
- **Rate Limiting** — 2,500 API requests per 15 minutes; 20 auth attempts per hour.
- **bcryptjs** — Passwords hashed with 12 salt rounds.
- **JWT** — Stateless tokens with 8-hour expiry.
- **CORS** — Strict origin allowlisting for API routes.
- **Input Validation** — All inputs sanitized via `express-validator`.
- **Trust Proxy** — Properly configured for deployment behind load balancers.

---

## 📋 Assumptions

- **Database**: Cloud-hosted PostgreSQL (Neon) with pooled connections via Prisma ORM.
- **Hosting**: Split deployment — Vercel (frontend) + Render (backend API & redirect engine).
- **Authentication**: JWT for stateless sessions; Google OAuth for social login. Google-only users are guided to use "Continue with Google" when attempting email login.
- **Browser Requirements**: Modern browsers with JavaScript enabled for features like copy-to-clipboard, PDF generation, QR codes, drag-and-drop CSV upload, and command palette.
- **Analytics**: Visit tracking is fire-and-forget (non-blocking) for maximum redirect speed.

---

## 🔮 Future Roadmap

- [ ] **Custom Domains** — White-labeled short URLs (e.g., `link.yourbrand.com`)
- [ ] **Team Workspaces** — Collaborative link management with role-based access
- [ ] **Public API & API Keys** — Developer access to programmatically manage links
- [ ] **UTM Builder** — Campaign tracking with full UTM parameter integration
- [ ] **Link-in-Bio Pages** — Customizable bio pages with themes and social links (schema ready)
- [ ] **Webhook Notifications** — Real-time callbacks on link clicks
- [ ] **A/B Testing** — Split traffic across multiple destinations with analytics

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Built with 💜 by [Sanjai Mohan](https://github.com/sanjaim25)


</div>

# TinyHop URL Shortener - Complete Technical Documentation

> **PREPARE.md** - A comprehensive guide explaining every aspect of the TinyHop URL Shortener project.  
> This document covers architecture, file structure, code explanations, database schema, API workflows, and more.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack Explained](#technology-stack-explained)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Backend (Server) Explained](#backend-server-explained)
7. [Frontend (Client) Explained](#frontend-client-explained)
8. [Authentication Flow](#authentication-flow)
9. [URL Shortening Flow](#url-shortening-flow)
10. [Analytics System](#analytics-system)
11. [Bulk Processing System](#bulk-processing-system)
12. [API Endpoints Reference](#api-endpoints-reference)
13. [Component Breakdown](#component-breakdown)
14. [State Management](#state-management)
15. [Security Implementation](#security-implementation)
16. [Performance Optimizations](#performance-optimizations)
17. [Error Handling](#error-handling)
18. [Testing Strategy](#testing-strategy)
19. [Deployment Guide](#deployment-guide)
20. [Best Practices Used](#best-practices-used)

---


## 1. Project Overview

### What is TinyHop?

TinyHop is a modern, full-stack URL shortening service similar to Bitly or TinyURL. It allows users to:
- Convert long URLs into short, memorable links
- Track click analytics with detailed insights
- Create custom aliases for branded links
- Set expiration dates and password protection
- Generate QR codes for shortened links
- Bulk process multiple URLs via CSV upload
- Export analytics data as CSV or PDF

### Key Features Breakdown

1. **URL Shortening**
   - Generates 6-character alphanumeric codes using nanoid
   - Supports custom aliases (minimum 3 characters)
   - Validates URLs and checks for duplicates
   - Stores original URL, short code, and metadata

2. **User Authentication**
   - JWT-based authentication system
   - Secure password hashing with bcrypt (12 rounds)
   - 7-day token expiration
   - Protected routes requiring authentication

3. **Analytics & Tracking**
   - Real-time click counting
   - Geographic location tracking (country, city)
   - Device type detection (mobile, tablet, desktop)
   - Browser and OS information
   - Referrer tracking
   - Time-based analytics with charts

4. **Advanced Features**
   - Link expiration with datetime picker
   - Password protection for links
   - QR code generation
   - Bulk URL processing with CSV import/export
   - PDF export for analytics
   - Search and filter functionality

5. **User Interface**
   - Modern, responsive design
   - Smooth animations and transitions
   - Dark theme with purple accent colors
   - Intuitive dashboard with statistics
   - Mobile-friendly interface

---


## 2. Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                     │
│                    http://localhost:5173                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Application (Vite)                            │  │
│  │  - Components (UI)                                   │  │
│  │  - Context (State Management)                        │  │
│  │  - API Layer (Axios)                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP Requests (JSON)
                           │ Authorization: Bearer <JWT>
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Node.js/Express)                  │
│                    http://localhost:5000                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express Application                                 │  │
│  │  - Routes (API Endpoints)                            │  │
│  │  - Middleware (Auth, CORS, etc.)                     │  │
│  │  - Controllers (Business Logic)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Prisma ORM
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                             │  │
│  │  - User (authentication)                             │  │
│  │  - Url (shortened links)                             │  │
│  │  - Click (analytics data)                            │  │
│  │  - Batch (bulk operations)                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow Example

**Creating a Shortened URL:**

1. User enters URL in React form
2. React sends POST request to `/api/urls` with JWT token
3. Express middleware validates JWT token
4. Controller validates URL format
5. Prisma generates short code (or uses custom alias)
6. Data saved to PostgreSQL database
7. Server responds with shortened URL data
8. React updates UI with new link

### Communication Protocol

- **Protocol**: HTTP/HTTPS
- **Data Format**: JSON
- **Authentication**: JWT Bearer tokens in Authorization header
- **CORS**: Enabled for localhost:5173
- **Status Codes**: Standard HTTP codes (200, 201, 400, 401, 404, 500)

---


## 3. Technology Stack Explained

### Backend Technologies

#### 1. **Node.js**
- **Version**: 18+
- **Purpose**: JavaScript runtime for server-side code
- **Why**: Fast, efficient, large ecosystem, same language as frontend

#### 2. **Express.js**
- **Version**: 4.x     
- **Purpose**: Web application framework
- **Features Used**:
  - Routing for API endpoints
  - Middleware for authentication
  - JSON body parsing
  - CORS configuration
  - Static file serving for redirects

#### 3. **Prisma ORM**
- **Version**: 5.x
- **Purpose**: Database ORM (Object-Relational Mapping)
- **Features Used**:
  - Type-safe database queries
  - Auto-generated TypeScript types
  - Migration management
  - Database introspection
  - Transaction support
- **Why**: Eliminates SQL injection, provides type safety, simplifies queries

#### 4. **PostgreSQL**
- **Version**: 14+
- **Purpose**: Relational database
- **Why**: ACID compliant, reliable, supports complex queries, scalable
- **Tables**: User, Url, Click, Batch

#### 5. **JWT (jsonwebtoken)**
- **Purpose**: Authentication tokens
- **Features**:
  - Stateless authentication
  - 7-day token expiry
  - Signed with secret key
  - Contains user ID and email

#### 6. **bcryptjs**
- **Purpose**: Password hashing
- **Salt Rounds**: 12
- **Why**: Industry-standard, prevents rainbow table attacks

#### 7. **nanoid**
- **Purpose**: Generate short, unique IDs
- **Configuration**: 6 characters, alphanumeric
- **Why**: URL-safe, collision-resistant, fast

#### 8. **express-validator**
- **Purpose**: Input validation
- **Used For**:
  - Email format validation
  - URL format validation
  - Custom alias validation
  - Password strength checks

### Frontend Technologies

#### 1. **React 18**
- **Purpose**: UI library
- **Features Used**:
  - Functional components
  - Hooks (useState, useEffect, useContext, useRef, useCallback)
  - Context API for state management
  - React Router for navigation

#### 2. **Vite**
- **Purpose**: Build tool and dev server
- **Why**: Fast HMR (Hot Module Replacement), optimized builds
- **Configuration**: Port 5173, proxy to backend

#### 3. **React Router v6**
- **Purpose**: Client-side routing
- **Features Used**:
  - Protected routes
  - Navigation guards
  - URL parameters
  - Programmatic navigation

#### 4. **Axios**
- **Purpose**: HTTP client
- **Features Used**:
  - Interceptors for JWT tokens
  - Automatic JSON parsing
  - Error handling
  - Base URL configuration

#### 5. **React Hot Toast**
- **Purpose**: Toast notifications
- **Why**: Lightweight, customizable, animated

#### 6. **Recharts**
- **Purpose**: Data visualization
- **Used For**: Click analytics charts
- **Chart Types**: Area charts, bar charts

#### 7. **qrcode.react**
- **Purpose**: QR code generation
- **Features**: Customizable size, colors, error correction

#### 8. **jsPDF & jspdf-autotable**
- **Purpose**: PDF generation
- **Used For**: Exporting bulk URL results to PDF

### Development Tools

#### 1. **ESM (ES Modules)**
- Used throughout both frontend and backend
- Modern import/export syntax
- Better tree-shaking for smaller bundles

#### 2. **Environment Variables**
- `.env` files for configuration
- Separate configs for development and production
- Sensitive data protection

---


## 4. Project Structure

### Root Directory
```
url_shortner/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js application
├── README.md              # Project documentation
├── PREPARE.md             # This file
├── FEATURES_FIXED.md      # Development history
├── FIXED_AND_RUNNING.md   # Setup verification
├── LOGIN_FIXED.md         # Authentication fixes log
├── PROJECT_RUNNING.md     # Runtime status
├── READY_TO_USE.md        # Quick start guide
├── REDESIGN_SUMMARY.md    # Design changes log
├── START_HERE.md          # Initial setup guide
└── TRANSFORMATION_COMPLETE.md  # Migration notes
```

### Server Structure (Backend)
```
server/
├── prisma/
│   ├── schema.prisma      # Database schema definition
│   └── migrations/        # Database migration history
│       ├── 20260611165530_init/
│       ├── 20260611171343_extend_schema/
│       ├── 20260613115857_add_user_name/
│       └── 20260613153925_add_batch_support/
├── src/
│   ├── index.js           # Main server file, entry point
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js        # Authentication routes (signup, login)
│   │   ├── urls.js        # URL shortening routes
│   │   └── analytics.js   # Analytics routes
│   └── utils/
│       └── generateCode.js # Short code generator
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
└── seed.js                # Database seeding script
```

### Client Structure (Frontend)
```
client/
├── public/                # Static assets
├── src/
│   ├── api/
│   │   └── axios.js       # Axios configuration and interceptors
│   ├── components/
│   │   ├── animations/
│   │   │   ├── AnimatedStats.jsx      # Animated statistics
│   │   │   ├── AnimatedURLCard.jsx    # Animated URL cards
│   │   │   └── FloatingDemo.jsx       # Floating elements
│   │   ├── effects/
│   │   │   ├── ParticleBackground.jsx # Background particles
│   │   │   └── SuccessConfetti.jsx    # Confetti animation
│   │   ├── CommandPalette.jsx         # Command search
│   │   ├── Footer.jsx                 # Site footer
│   │   ├── Logo.jsx                   # TinyHop logo
│   │   ├── Navbar.jsx                 # Navigation bar
│   │   ├── ProtectedRoute.jsx         # Auth route guard
│   │   ├── QRModal.jsx                # QR code display modal
│   │   ├── ScrollToTop.jsx            # Scroll restoration
│   │   └── UrlCard.jsx                # URL display card
│   ├── context/
│   │   └── AuthContext.jsx            # Authentication state
│   ├── hooks/
│   │   ├── useMagneticButton.js       # Button hover effect
│   │   └── useScrollReveal.js         # Scroll animations
│   ├── pages/
│   │   ├── features/                  # Feature detail pages
│   │   │   ├── Analytics.jsx
│   │   │   ├── CustomAliases.jsx
│   │   │   ├── FeaturePageLayout.jsx
│   │   │   ├── FeaturesIndex.jsx
│   │   │   ├── LinkExpiry.jsx
│   │   │   ├── LinkShortening.jsx
│   │   │   ├── QRCodes.jsx
│   │   │   └── SmartRouting.jsx
│   │   ├── About.jsx                  # About page
│   │   ├── Analytics.jsx              # Analytics page
│   │   ├── AnalyticsShowcase.jsx      # Analytics demo
│   │   ├── Blog.jsx                   # Blog page
│   │   ├── BulkShorten.jsx            # Bulk upload page
│   │   ├── Contact.jsx                # Contact page
│   │   ├── Dashboard.jsx              # Main dashboard
│   │   ├── DashboardEnhanced.jsx      # Enhanced dashboard
│   │   ├── Developers.jsx             # API documentation
│   │   ├── HelpDesk.jsx               # FAQ/Help page
│   │   ├── Landing.jsx                # Homepage
│   │   ├── Legal.jsx                  # Legal information
│   │   ├── Login.jsx                  # Login page
│   │   ├── Pricing.jsx                # Pricing page
│   │   ├── PrivacyPolicy.jsx          # Privacy policy
│   │   ├── Profile.jsx                # User profile
│   │   ├── Shorten.jsx                # URL shortening form
│   │   ├── Signup.jsx                 # Signup page
│   │   ├── SimplePage.jsx             # Template page
│   │   └── TermsOfService.jsx         # Terms of service
│   ├── App.jsx                        # Main app component
│   ├── index.css                      # Global styles
│   └── main.jsx                       # React entry point
├── .env                               # Environment variables
├── index.html                         # HTML template
├── package.json                       # Dependencies
├── postcss.config.js                  # PostCSS config
├── tailwind.config.js                 # Tailwind config
└── vite.config.js                     # Vite config
```

---


## 5. Database Schema

### Complete Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User model - stores authentication information
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String?  // optional user display name
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  urls      Url[]    // one-to-many relationship
  batches   Batch[]  // one-to-many relationship
}

// Url model - stores shortened URLs
model Url {
  id          Int       @id @default(autoincrement())
  originalUrl String    // the long URL to redirect to
  shortCode   String    @unique  // 6-char code or custom alias
  password    String?   // optional bcrypt hashed password
  expiresAt   DateTime? // optional expiration date
  clickCount  Int       @default(0)  // total clicks
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      Int       // foreign key to User
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  clicks      Click[]   // one-to-many relationship
  batchId     Int?      // optional foreign key to Batch
  batch       Batch?    @relation(fields: [batchId], references: [id], onDelete: SetNull)
  
  @@index([userId])      // index for faster queries
  @@index([shortCode])   // index for redirect lookups
  @@index([batchId])     // index for batch queries
}

// Click model - stores analytics data
model Click {
  id        Int      @id @default(autoincrement())
  urlId     Int      // foreign key to Url
  url       Url      @relation(fields: [urlId], references: [id], onDelete: Cascade)
  timestamp DateTime @default(now())
  ipAddress String?  // visitor IP (for geo-location)
  userAgent String?  // browser user agent string
  referer   String?  // referring website
  country   String?  // parsed from IP
  city      String?  // parsed from IP
  device    String?  // mobile, tablet, desktop
  browser   String?  // Chrome, Firefox, Safari, etc.
  os        String?  // Windows, macOS, Linux, etc.
  
  @@index([urlId])     // index for analytics queries
  @@index([timestamp]) // index for time-based queries
}

// Batch model - stores bulk upload information
model Batch {
  id          Int      @id @default(autoincrement())
  name        String   // user-defined batch name
  total       Int      // total URLs in batch
  successful  Int      // successfully shortened
  failed      Int      // failed to shorten
  createdAt   DateTime @default(now())
  userId      Int      // foreign key to User
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  urls        Url[]    // one-to-many relationship
  
  @@index([userId])    // index for user queries
}
```

### Schema Explanation

#### User Table
- **id**: Auto-incrementing primary key
- **email**: Unique identifier for login (must be valid email format)
- **password**: Bcrypt hashed with 12 salt rounds (never stored in plain text)
- **name**: Optional display name for personalization
- **createdAt**: Automatically set when account is created
- **updatedAt**: Automatically updated on any change
- **urls**: Virtual field linking to all user's shortened URLs
- **batches**: Virtual field linking to all user's bulk uploads

#### Url Table
- **id**: Auto-incrementing primary key
- **originalUrl**: The destination URL (validated as proper URL format)
- **shortCode**: Unique 6-character code (nanoid) or custom alias
- **password**: Optional bcrypt hashed password for protected links
- **expiresAt**: Optional expiration datetime (nullable)
- **clickCount**: Tracks total clicks (updated atomically in transactions)
- **createdAt**: When the short URL was created
- **updatedAt**: Last modification time
- **userId**: Foreign key linking to owner
- **user**: Reference to User model
- **clicks**: Virtual field linking to all click records
- **batchId**: Optional foreign key if created via bulk upload
- **batch**: Reference to Batch model

**Indexes**: 
- userId: Fast user-specific queries
- shortCode: Fast redirect lookups (most frequent query)
- batchId: Fast batch-related queries

#### Click Table
- **id**: Auto-incrementing primary key
- **urlId**: Foreign key to the shortened URL
- **url**: Reference to Url model
- **timestamp**: When the click occurred (for time-series analytics)
- **ipAddress**: Visitor's IP (used for geo-location, can be null for privacy)
- **userAgent**: Browser's user agent string
- **referer**: Where the visitor came from (nullable)
- **country**: Parsed from IP address
- **city**: Parsed from IP address
- **device**: Detected device type (mobile/tablet/desktop)
- **browser**: Detected browser (Chrome, Firefox, etc.)
- **os**: Detected operating system

**Indexes**:
- urlId: Fast analytics queries per URL
- timestamp: Time-based filtering and sorting

#### Batch Table
- **id**: Auto-incrementing primary key
- **name**: User-friendly name for the batch
- **total**: Count of URLs in the batch
- **successful**: How many were successfully shortened
- **failed**: How many failed validation/creation
- **createdAt**: When the batch was processed
- **userId**: Owner of the batch
- **user**: Reference to User model
- **urls**: All URLs created in this batch

**Indexes**:
- userId: Fast user-specific batch queries

### Relationships

```
User (1) ──< (many) Url
User (1) ──< (many) Batch
Url (1) ──< (many) Click
Batch (1) ──< (many) Url
```

### Cascade Rules

- **User deleted** → All their URLs are deleted → All clicks are deleted
- **User deleted** → All their batches are deleted
- **Url deleted** → All its clicks are deleted
- **Batch deleted** → URLs remain but batchId set to null

---


## 6. Backend (Server) Explained

### File: server/src/index.js

This is the main server file. It sets up Express, connects to the database, and defines all routes.

**Key Sections:**

#### 1. Imports and Setup
```javascript
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import urlRoutes from './routes/urls.js'
import analyticsRoutes from './routes/analytics.js'
```
- **express**: Web framework
- **cors**: Enable cross-origin requests from frontend
- **PrismaClient**: Database ORM
- **routes**: Modular route handlers

#### 2. Initialize App
```javascript
const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000
```
- Creates Express application instance
- Creates Prisma client for database access
- Sets port from environment or defaults to 5000

#### 3. Middleware Configuration
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
```
- **CORS**: Allows requests from frontend URL only (security)
- **express.json()**: Parses JSON request bodies

#### 4. API Routes
```javascript
app.use('/api/auth', authRoutes)
app.use('/api/urls', urlRoutes)
app.use('/api/analytics', analyticsRoutes)
```
- Mounts route handlers at specific paths
- All auth endpoints start with /api/auth
- All URL endpoints start with /api/urls
- All analytics endpoints start with /api/analytics

#### 5. Redirect Route (Core Functionality)
```javascript
app.get('/:code', async (req, res) => {
  const { code } = req.params
  
  // Find URL in database
  const url = await prisma.url.findUnique({
    where: { shortCode: code },
    include: { user: true }
  })
  
  // Handle not found
  if (!url) {
    return res.status(404).send('URL not found')
  }
  
  // Handle expired
  if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
    return res.status(410).send('URL expired')
  }
  
  // Handle password protected
  if (url.password) {
    // Show password form (simplified)
    return res.send('Password required')
  }
  
  // Record click analytics
  await prisma.$transaction([
    prisma.click.create({
      data: {
        urlId: url.id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        referer: req.headers.referer,
        // Device/browser detection logic here
      }
    }),
    prisma.url.update({
      where: { id: url.id },
      data: { clickCount: { increment: 1 } }
    })
  ])
  
  // Redirect to original URL
  res.redirect(301, url.originalUrl)
})
```

**This route:**
- Extracts short code from URL parameter
- Looks up URL in database
- Checks if URL exists (404 if not)
- Checks if expired (410 Gone if expired)
- Checks if password protected
- Records click analytics in transaction
- Increments click counter atomically
- Redirects user to original URL (HTTP 301)

#### 6. Server Startup
```javascript
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
```
- Starts server on specified port
- Logs success message

---

### File: server/src/middleware/auth.js

JWT authentication middleware that protects routes.

```javascript
import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // "Bearer TOKEN"
  
  // No token provided
  if (!token) {
    return res.status(401).json({ error: 'Access denied' })
  }
  
  try {
    // Verify token with secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    
    // Attach user info to request object
    req.user = verified // Contains: { userId, email }
    
    // Continue to next middleware/route handler
    next()
  } catch (err) {
    // Token invalid or expired
    res.status(403).json({ error: 'Invalid token' })
  }
}
```

**How it works:**
1. Extracts JWT from "Authorization: Bearer TOKEN" header
2. Verifies token signature using JWT_SECRET
3. If valid, attaches decoded user info to req.user
4. Calls next() to continue to route handler
5. If invalid, returns 403 Forbidden error

**Usage:**
```javascript
router.get('/protected-route', authenticateToken, (req, res) => {
  // req.user now contains { userId, email }
})
```

---


### File: server/src/routes/auth.js

Handles user registration, login, and profile management.

```javascript
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { body, validationResult } from 'express-validator'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const prisma = new PrismaClient()

// POST /api/auth/signup - Register new user
router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().trim()
], async (req, res) => {
  // Validate input
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  
  const { email, password, name } = req.body
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    
    // Hash password (12 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    })
    
    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Return user info and token (exclude password)
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/login - Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  
  const { email, password } = req.body
  
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    // Compare password with hashed password
    const validPassword = await bcrypt.compare(password, user.password)
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Return user info and token
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // req.user comes from authenticateToken middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true } // Exclude password
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', authenticateToken, [
  body('name').optional().trim()
], async (req, res) => {
  const { name } = req.body
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name },
      select: { id: true, email: true, name: true }
    })
    
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
```

**Key Points:**
- Uses express-validator for input validation
- Passwords hashed with bcrypt (12 rounds = high security)
- JWT tokens expire after 7 days
- Password never returned in responses
- All database queries use Prisma
- Proper error handling for all cases

---


### File: server/src/routes/urls.js

Handles URL shortening, bulk operations, and CRUD operations.

**Key Endpoints:**

#### 1. GET /api/urls - Get all user's URLs
```javascript
router.get('/', authenticateToken, async (req, res) => {
  try {
    const urls = await prisma.url.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    })
    res.json(urls)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})
```
- Requires authentication
- Returns all URLs owned by the user
- Ordered by newest first
- Includes click count
- Uses Prisma's _count feature for efficient counting

#### 2. POST /api/urls - Create shortened URL
```javascript
router.post('/', authenticateToken, [
  body('originalUrl').isURL(),
  body('customAlias').optional().isLength({ min: 3 }),
  body('expiresAt').optional().isISO8601(),
  body('password').optional()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  
  const { originalUrl, customAlias, expiresAt, password } = req.body
  
  try {
    // Generate short code or use custom alias
    let shortCode = customAlias || generateCode()
    
    // Check if short code already exists
    const existing = await prisma.url.findUnique({
      where: { shortCode }
    })
    
    if (existing) {
      return res.status(400).json({ error: 'Alias already taken' })
    }
    
    // Hash password if provided
    let hashedPassword = null
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12)
    }
    
    // Create URL in database
    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortCode,
        password: hashedPassword,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId: req.user.userId
      }
    })
    
    res.status(201).json(url)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})
```
- Validates URL format
- Custom alias must be at least 3 characters
- Checks for duplicate aliases
- Hashes password if provided
- Creates URL with all metadata

#### 3. POST /api/urls/bulk - Bulk shorten URLs
```javascript
router.post('/bulk', authenticateToken, async (req, res) => {
  const { urls, batchName } = req.body
  
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Invalid URLs array' })
  }
  
  if (urls.length > 1000) {
    return res.status(400).json({ error: 'Maximum 1000 URLs per batch' })
  }
  
  try {
    // Create batch record
    const batch = await prisma.batch.create({
      data: {
        name: batchName || `Batch ${new Date().toISOString()}`,
        total: urls.length,
        successful: 0,
        failed: 0,
        userId: req.user.userId
      }
    })
    
    const results = []
    let successful = 0
    let failed = 0
    
    // Process each URL
    for (const item of urls) {
      try {
        // Validate URL
        if (!isValidUrl(item.originalUrl)) {
          results.push({
            originalUrl: item.originalUrl,
            status: 'failed',
            error: 'Invalid URL format'
          })
          failed++
          continue
        }
        
        // Generate or use custom alias
        let shortCode = item.customAlias || generateCode()
        
        // Check for duplicates
        const existing = await prisma.url.findUnique({
          where: { shortCode }
        })
        
        if (existing) {
          results.push({
            originalUrl: item.originalUrl,
            status: 'failed',
            error: 'Alias already taken'
          })
          failed++
          continue
        }
        
        // Create URL
        const url = await prisma.url.create({
          data: {
            originalUrl: item.originalUrl,
            shortCode,
            userId: req.user.userId,
            batchId: batch.id
          }
        })
        
        results.push({
          originalUrl: item.originalUrl,
          shortCode: url.shortCode,
          status: 'success'
        })
        successful++
      } catch (err) {
        results.push({
          originalUrl: item.originalUrl,
          status: 'failed',
          error: err.message
        })
        failed++
      }
    }
    
    // Update batch statistics
    await prisma.batch.update({
      where: { id: batch.id },
      data: { successful, failed }
    })
    
    res.json({
      batchId: batch.id,
      total: urls.length,
      successful,
      failed,
      results
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})
```
- Processes up to 1000 URLs at once
- Creates batch record first
- Validates each URL individually
- Handles errors gracefully per URL
- Updates batch statistics
- Returns detailed results array

#### 4. DELETE /api/urls/:id - Delete URL
```javascript
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  
  try {
    // Check ownership
    const url = await prisma.url.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' })
    }
    
    if (url.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' })
    }
    
    // Delete URL (cascade deletes clicks)
    await prisma.url.delete({
      where: { id: parseInt(id) }
    })
    
    res.json({ message: 'URL deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})
```
- Checks ownership before deletion
- Cascade deletes all associated clicks
- Returns 403 if user doesn't own the URL

---


### File: server/src/utils/generateCode.js

```javascript
import { customAlphabet } from 'nanoid'

// Create nanoid with custom alphabet (alphanumeric only)
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)

export default function generateCode() {
  return nanoid() // Returns 6-character string like "aB3xY9"
}
```

**Why 6 characters?**
- 62 characters (0-9, A-Z, a-z) ^ 6 positions = 56 billion+ combinations
- Collision probability is extremely low
- Short enough for easy sharing
- URL-safe characters only

---

## 7. Frontend (Client) Explained

### File: client/src/main.jsx

Entry point for React application.

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

**Component Hierarchy:**
- **React.StrictMode**: Enables additional checks in development
- **BrowserRouter**: Enables client-side routing
- **AuthProvider**: Provides authentication context to all components
- **App**: Main application component
- **Toaster**: Toast notification container

---

### File: client/src/App.jsx

Main routing configuration.

```javascript
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
// ... import all pages

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<HelpDesk />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/shorten" element={
          <ProtectedRoute>
            <Shorten />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/bulk" element={
          <ProtectedRoute>
            <BulkShorten />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
```

**Route Types:**
- **Public**: Accessible by anyone
- **Protected**: Require authentication (redirect to /login if not authenticated)
- **Catch-all**: Redirects unknown routes to homepage

---

### File: client/src/context/AuthContext.jsx

Manages authentication state across the application.

```javascript
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      api.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    const { user, token } = res.data
    
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
    
    return user
  }

  const signup = async (email, password, name) => {
    const res = await api.post('/api/auth/signup', { email, password, name })
    const { user, token } = res.data
    
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
    
    return user
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      signup, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

**Features:**
- Stores JWT token in localStorage (persists across page reloads)
- Auto-validates token on page load
- Provides login, signup, logout functions
- Makes user data available to all components
- Custom hook `useAuth()` for easy access

---

### File: client/src/api/axios.js

Configured Axios instance with JWT interceptor.

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

**Features:**
- Base URL from environment variable
- Automatically adds JWT to Authorization header
- Handles token expiration (redirects to login)
- Centralized error handling

---


## 8. Authentication Flow

### Signup Flow

```
1. User fills form (email, password, name)
   ↓
2. React validates input (client-side)
   ↓
3. POST /api/auth/signup
   ↓
4. Server validates with express-validator
   ↓
5. Check if email already exists
   ↓
6. Hash password with bcrypt (12 rounds)
   ↓
7. Create user in database
   ↓
8. Generate JWT token (expires 7 days)
   ↓
9. Return user + token
   ↓
10. Client stores token in localStorage
   ↓
11. AuthContext updates user state
   ↓
12. Redirect to /shorten page
```

### Login Flow

```
1. User enters email + password
   ↓
2. POST /api/auth/login
   ↓
3. Find user by email
   ↓
4. Compare password with bcrypt.compare()
   ↓
5. If invalid: return 400 error
   ↓
6. Generate JWT token
   ↓
7. Return user + token
   ↓
8. Store token in localStorage
   ↓
9. Update AuthContext
   ↓
10. Redirect to /shorten
```

### Protected Route Access

```
1. User navigates to /dashboard
   ↓
2. ProtectedRoute component checks auth state
   ↓
3. If no token: redirect to /login
   ↓
4. If token exists: render Dashboard
   ↓
5. All API requests include token in header
   ↓
6. Server validates token with JWT.verify()
   ↓
7. If valid: allow request
   ↓
8. If invalid/expired: return 401/403
   ↓
9. Axios interceptor catches error
   ↓
10. Remove token and redirect to /login
```

---

## 9. URL Shortening Flow

### Creating Short URL

```
1. User enters long URL in form
   ↓
2. Optional: Custom alias, expiry, password
   ↓
3. React validates URL format
   ↓
4. POST /api/urls with data
   ↓
5. Server validates URL with express-validator
   ↓
6. Generate shortCode (nanoid) or use custom alias
   ↓
7. Check if shortCode already exists
   ↓
8. If duplicate: return 400 error
   ↓
9. Hash password if provided
   ↓
10. Create URL record in database
   ↓
11. Return URL object to client
   ↓
12. Display shortened URL
   ↓
13. Show copy button + QR code option
```

### Redirect Flow

```
1. User clicks TinyHop.link/abc123
   ↓
2. Browser makes GET /abc123
   ↓
3. Server extracts "abc123" from URL
   ↓
4. Query database for shortCode = "abc123"
   ↓
5. If not found: return 404 HTML page
   ↓
6. If found: check expiration
   ↓
7. If expired: return 410 HTML page
   ↓
8. If password protected: show password form
   ↓
9. Record click analytics:
   - Create Click record
   - Increment clickCount
   - Parse IP for location
   - Parse User-Agent for device/browser
   ↓
10. Use Prisma transaction for atomicity
   ↓
11. Redirect to originalUrl (HTTP 301)
   ↓
12. Browser follows redirect
```

---

## 10. Analytics System

### Click Recording

```javascript
// When user clicks short link
await prisma.$transaction([
  // 1. Create click record
  prisma.click.create({
    data: {
      urlId: url.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
      country: parseCountryFromIP(req.ip),
      city: parseCityFromIP(req.ip),
      device: parseDeviceType(req.headers['user-agent']),
      browser: parseBrowserName(req.headers['user-agent']),
      os: parseOS(req.headers['user-agent'])
    }
  }),
  // 2. Increment counter atomically
  prisma.url.update({
    where: { id: url.id },
    data: { clickCount: { increment: 1 } }
  })
])
```

**Transaction ensures:**
- Both operations succeed or both fail
- No race conditions
- Accurate click counting

### Analytics Display

```javascript
// GET /api/analytics/:id
const clicks = await prisma.click.findMany({
  where: { urlId: parseInt(id) },
  orderBy: { timestamp: 'desc' },
  take: 100 // Last 100 clicks
})

// Aggregate data
const stats = {
  totalClicks: clicks.length,
  uniqueCountries: [...new Set(clicks.map(c => c.country))].length,
  deviceBreakdown: {
    mobile: clicks.filter(c => c.device === 'mobile').length,
    desktop: clicks.filter(c => c.device === 'desktop').length,
    tablet: clicks.filter(c => c.device === 'tablet').length
  },
  topCountries: groupBy(clicks, 'country'),
  topBrowsers: groupBy(clicks, 'browser'),
  clicksByDay: groupByDay(clicks)
}
```

**Visualizations:**
- Line/area charts for clicks over time (Recharts)
- Pie charts for device distribution
- Bar charts for geographic data
- Tables for detailed click logs

---

## 11. Bulk Processing System

### CSV Upload Flow

```
1. User selects CSV file
   ↓
2. JavaScript reads file content
   ↓
3. Parse CSV (split by lines and commas)
   ↓
4. Extract URLs and optional aliases
   ↓
5. Validate format (detect headers)
   ↓
6. POST /api/urls/bulk with array
   ↓
7. Server creates Batch record
   ↓
8. Loop through each URL:
   - Validate URL format
   - Generate/check shortCode
   - Create URL record
   - Link to batchId
   - Handle errors individually
   ↓
9. Update batch statistics
   ↓
10. Return results array
   ↓
11. Display results table
   ↓
12. Offer CSV/PDF export
```

### CSV Export

```javascript
// Generate CSV content
let csv = 'Original URL,Short Code,Short URL,Status,Error\n'

results.forEach(result => {
  csv += `"${result.originalUrl}",`
  csv += `${result.shortCode || ''},`
  csv += `"${baseURL}/${result.shortCode}",`
  csv += `${result.status},`
  csv += `${result.error || ''}\n`
})

// Create downloadable file
const blob = new Blob([csv], { type: 'text/csv' })
const url = URL.createObjectURL(blob)
const link = document.createElement('a')
link.href = url
link.download = `shortened-links-${Date.now()}.csv`
link.click()
```

### PDF Export

```javascript
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const doc = new jsPDF()

// Add header
doc.setFontSize(20)
doc.text('Bulk URL Shortening Results', 14, 20)

// Add summary
doc.setFontSize(10)
doc.text(`Total: ${total}`, 14, 30)
doc.text(`Successful: ${successful}`, 14, 36)
doc.text(`Failed: ${failed}`, 14, 42)

// Add table
autoTable(doc, {
  head: [['Original URL', 'Short Code', 'Status']],
  body: results.map(r => [r.originalUrl, r.shortCode, r.status]),
  startY: 55
})

// Download
doc.save(`results-${Date.now()}.pdf`)
```

---


## 12. API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/profile` | Yes | Update profile |

### URL Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/urls` | Yes | Get all user's URLs |
| POST | `/api/urls` | Yes | Create short URL |
| PUT | `/api/urls/:id` | Yes | Update URL |
| DELETE | `/api/urls/:id` | Yes | Delete URL |
| POST | `/api/urls/bulk` | Yes | Bulk shorten URLs |
| GET | `/:code` | No | Redirect to original |

### Batch Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/urls/batches` | Yes | Get all batches |
| GET | `/api/urls/batches/:id` | Yes | Get batch details |
| DELETE | `/api/urls/batches/:id` | Yes | Delete batch |

### Analytics Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/analytics/:id` | Yes | Get URL analytics |

---

## 13. Component Breakdown

### Key React Components

#### Navbar.jsx
- Displays logo and navigation links
- Shows user menu when logged in
- Responsive mobile menu
- Logout functionality

#### Dashboard.jsx
- Lists all user's shortened URLs
- Search and filter functionality
- Create new URL modal
- Edit/Delete URL actions
- Analytics preview
- Batch view mode

#### Shorten.jsx
- Main URL shortening form
- Custom alias input with prefix display
- Expiry date picker
- Password protection toggle
- Real-time validation
- Success animation

#### BulkShorten.jsx
- CSV file upload dropzone
- CSV format instructions
- Results table display
- Export to CSV/PDF
- Persistent results in localStorage

#### ProtectedRoute.jsx
- Checks authentication status
- Redirects to /login if not authenticated
- Shows loading spinner while checking

#### QRModal.jsx
- Displays QR code for short URL
- Download QR as PNG
- Customizable size and colors

---

## 14. State Management

### Global State (Context API)

**AuthContext**:
```javascript
{
  user: { id, email, name } | null,
  token: string | null,
  loading: boolean,
  login: (email, password) => Promise,
  signup: (email, password, name) => Promise,
  logout: () => void,
  updateUser: (user) => void
}
```

### Local State (useState)

Examples:
```javascript
// Form state
const [url, setUrl] = useState('')
const [alias, setAlias] = useState('')
const [password, setPassword] = useState('')

// Loading state
const [loading, setLoading] = useState(false)

// Data state
const [urls, setUrls] = useState([])
const [analytics, setAnalytics] = useState(null)

// UI state
const [showModal, setShowModal] = useState(false)
const [error, setError] = useState(null)
```

### Persistent State (localStorage)

- JWT token
- Bulk upload results
- User preferences

---

## 15. Security Implementation

### Backend Security

1. **Password Hashing**:
   - bcrypt with 12 salt rounds
   - Never store plain text passwords
   - Comparison uses bcrypt.compare()

2. **JWT Tokens**:
   - Signed with secret key
   - 7-day expiration
   - Verified on every protected request
   - Stateless (no server-side sessions)

3. **Input Validation**:
   - express-validator for all inputs
   - URL format validation
   - Email format validation
   - SQL injection prevention (Prisma ORM)

4. **CORS Protection**:
   - Only allows requests from CLIENT_URL
   - Credentials enabled
   - Pre-flight requests handled

5. **Rate Limiting** (recommended addition):
   - Limit signup attempts
   - Limit login attempts
   - Prevent brute force attacks

### Frontend Security

1. **XSS Prevention**:
   - React auto-escapes JSX
   - No dangerouslySetInnerHTML used
   - Sanitize user input

2. **CSRF Protection**:
   - Same-origin requests
   - Token-based auth (not cookies)

3. **Secure Storage**:
   - JWT in localStorage (XSS risk, but acceptable for MVP)
   - No sensitive data in localStorage
   - Consider httpOnly cookies for production

4. **Client-Side Validation**:
   - Pre-validates before server request
   - Reduces unnecessary requests
   - Better UX with instant feedback

---

## 16. Performance Optimizations

### Backend Optimizations

1. **Database Indexes**:
   ```prisma
   @@index([userId])    // Fast user queries
   @@index([shortCode]) // Fast redirects
   @@index([timestamp]) // Fast analytics
   ```

2. **Prisma Select Queries**:
   ```javascript
   // Only fetch needed fields
   select: { id: true, email: true, name: true }
   ```

3. **Transactions**:
   ```javascript
   // Atomic operations
   await prisma.$transaction([...])
   ```

4. **Connection Pooling**:
   - Prisma automatically pools connections
   - Configurable in DATABASE_URL

### Frontend Optimizations

1. **Code Splitting**:
   - Vite automatically splits routes
   - Lazy loading for large components

2. **Memoization**:
   ```javascript
   const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b])
   const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
   ```

3. **Debouncing**:
   ```javascript
   // Delay search API calls
   useEffect(() => {
     const timer = setTimeout(() => {
       fetchResults(searchQuery)
     }, 300)
     return () => clearTimeout(timer)
   }, [searchQuery])
   ```

4. **Virtual Scrolling** (for large lists):
   - Consider react-window or react-virtualized
   - Only render visible items

---


## 17. Error Handling

### Backend Error Handling

```javascript
// Route handler pattern
router.post('/endpoint', async (req, res) => {
  try {
    // Business logic
    const result = await someOperation()
    res.json(result)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Validation errors
const errors = validationResult(req)
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() })
}

// Not found errors
if (!resource) {
  return res.status(404).json({ error: 'Resource not found' })
}

// Unauthorized errors
if (resource.userId !== req.user.userId) {
  return res.status(403).json({ error: 'Access denied' })
}
```

### Frontend Error Handling

```javascript
// API call with error handling
try {
  const response = await api.post('/api/urls', data)
  setResult(response.data)
  toast.success('URL shortened!')
} catch (error) {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data.error || 'Something went wrong'
    toast.error(message)
  } else if (error.request) {
    // Request made but no response
    toast.error('Network error. Please check your connection.')
  } else {
    // Something else happened
    toast.error('An unexpected error occurred')
  }
} finally {
  setLoading(false)
}
```

### Common HTTP Status Codes Used

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST (created resource) |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 410 | Gone | Resource expired (for URLs) |
| 500 | Internal Server Error | Unexpected server error |

---

## 18. Testing Strategy

### Backend Testing (Recommended)

```javascript
// Example with Jest + Supertest

describe('POST /api/auth/signup', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe('test@example.com')
  })
  
  it('should reject duplicate email', async () => {
    // Create user first
    await createUser('test@example.com')
    
    // Try to create again
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
    
    expect(res.status).toBe(400)
    expect(res.body.error).toContain('already registered')
  })
})

describe('GET /:code redirect', () => {
  it('should redirect to original URL', async () => {
    // Create test URL
    const url = await createTestURL('abc123', 'https://example.com')
    
    const res = await request(app)
      .get('/abc123')
      .redirects(0) // Don't follow redirects
    
    expect(res.status).toBe(301)
    expect(res.header.location).toBe('https://example.com')
  })
  
  it('should return 404 for non-existent code', async () => {
    const res = await request(app).get('/invalid')
    expect(res.status).toBe(404)
  })
  
  it('should return 410 for expired URL', async () => {
    const url = await createExpiredURL('xyz789')
    const res = await request(app).get('/xyz789')
    expect(res.status).toBe(410)
  })
})
```

### Frontend Testing (Recommended)

```javascript
// Example with React Testing Library

describe('Login Component', () => {
  it('should render login form', () => {
    render(<Login />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })
  
  it('should show error for invalid credentials', async () => {
    const mockLogin = jest.fn().mockRejectedValue({
      response: { data: { error: 'Invalid credentials' } }
    })
    
    render(<Login loginFn={mockLogin} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' }
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })
  
  it('should redirect on successful login', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' })
    const mockNavigate = jest.fn()
    
    render(<Login loginFn={mockLogin} navigateFn={mockNavigate} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/shorten')
    })
  })
})
```

---

## 19. Deployment Guide

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare Environment Variables**:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-production-secret
   PORT=5000
   CLIENT_URL=https://your-frontend-domain.com
   NODE_ENV=production
   ```

2. **Build Command**:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   ```

3. **Start Command**:
   ```bash
   node src/index.js
   ```

4. **Database**:
   - Use managed PostgreSQL (Supabase, Neon, Railway)
   - Run migrations in production
   - Set up backups

### Frontend Deployment (Vercel/Netlify)

1. **Build Command**:
   ```bash
   npm run build
   ```

2. **Output Directory**:
   ```
   dist/
   ```

3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

4. **Redirects** (for SPA routing):
   ```
   /* /index.html 200
   ```

### Environment Checklist

- [ ] Database connection string updated
- [ ] JWT secret is strong and unique
- [ ] CORS origin set to production frontend URL
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] SSL/HTTPS enabled
- [ ] API rate limiting configured
- [ ] Error logging setup (Sentry, etc.)
- [ ] Monitoring setup (uptime, performance)

---

## 20. Best Practices Used

### Code Organization

1. **Separation of Concerns**:
   - Routes handle HTTP logic
   - Services handle business logic
   - Models handle data access

2. **Modular Structure**:
   - Each route in separate file
   - Reusable components
   - Shared utilities

3. **Environment Configuration**:
   - Separate .env files
   - No hardcoded credentials
   - Different configs for dev/prod

### Security Best Practices

1. **Never Trust User Input**:
   - Always validate
   - Sanitize data
   - Use parameterized queries

2. **Principle of Least Privilege**:
   - Users only access their data
   - Ownership checks on all operations
   - Role-based permissions

3. **Defense in Depth**:
   - Multiple layers of security
   - Client-side + server-side validation
   - Authentication + authorization

### Database Best Practices

1. **Use Transactions**:
   - For related operations
   - Ensures data consistency
   - Prevents race conditions

2. **Optimize Queries**:
   - Add indexes on frequently queried fields
   - Use select to fetch only needed data
   - Avoid N+1 query problems

3. **Handle Errors**:
   - Graceful error handling
   - Log errors for debugging
   - User-friendly error messages

### Frontend Best Practices

1. **Component Reusability**:
   - Create reusable components
   - Use props for customization
   - Keep components focused

2. **State Management**:
   - Lift state up when needed
   - Use context for global state
   - Keep state close to where it's used

3. **Performance**:
   - Minimize re-renders
   - Use memo and useCallback
   - Lazy load routes/components

### Git Best Practices

1. **Commit Messages**:
   - Clear, descriptive messages
   - Present tense ("Add feature" not "Added feature")
   - Reference issues when applicable

2. **Branching Strategy**:
   - main/master for production
   - develop for integration
   - feature/ branches for new features
   - hotfix/ branches for urgent fixes

3. **Code Reviews**:
   - Review before merging
   - Check for security issues
   - Ensure tests pass

---

## Conclusion

This documentation covers the complete technical architecture of the TinyHop URL Shortener project. It includes:

- ✅ Project structure and file organization
- ✅ Database schema and relationships
- ✅ Backend API implementation
- ✅ Frontend React application
- ✅ Authentication and authorization
- ✅ URL shortening and redirect logic
- ✅ Analytics and tracking system
- ✅ Bulk processing functionality
- ✅ Security measures
- ✅ Performance optimizations
- ✅ Error handling patterns
- ✅ Testing strategies
- ✅ Deployment procedures
- ✅ Best practices

For setup instructions, see [README.md](./README.md).  
For quick start, see [START_HERE.md](./START_HERE.md).

---

**Built with ❤️ using React, Node.js, PostgreSQL, and Prisma**

**Last Updated**: June 13, 2026

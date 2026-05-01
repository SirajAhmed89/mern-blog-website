# MERN Blog Platform

A full-stack blog platform built with MongoDB, Express, React, and Node.js. Features a rich admin dashboard, role-based access control, newsletter system, and a TipTap-powered rich text editor.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue) ![TypeScript](https://img.shields.io/badge/Frontend-TypeScript-blue) ![Node](https://img.shields.io/badge/Backend-Node.js-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### Public Blog
- Home page with featured hero post, recent posts, and category grid
- Blog feed with pagination and category filtering
- Full post detail page with social sharing and comment section
- Author profile pages
- Tag and category archive pages
- Full-text search

### Admin Dashboard
- Role-based access control (Superadmin / Admin with granular permissions)
- Post management — create, edit, publish, archive, set featured hero
- Rich text editor (TipTap) with image upload, tables, code blocks
- Category and tag management
- User management — create admins, assign permissions, ban/unban
- Comment moderation — approve, reject, delete
- Newsletter management — subscribers, stats, send updates
- Analytics dashboard
- Site settings — general, SEO, social links, feature toggles
- Code injection — custom header/footer HTML, CSS, JS

### Auth & Security
- Email + OTP verification on signup
- JWT authentication with 7-day expiry
- Rate limiting on auth routes
- Helmet security headers
- MongoDB injection prevention
- CORS configuration
- bcrypt password hashing

---

## 🗂️ Project Structure

```
mern-blog-website/
├── backend/                  # Express API
│   ├── config/               # DB and email config
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth, permissions, upload, error handling
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── scripts/              # Setup and seed scripts
│   ├── services/             # Business logic
│   ├── templates/            # Email templates
│   ├── utils/                # Helpers (pagination, slugify, etc.)
│   ├── validators/           # express-validator rules
│   ├── .env.example          # Environment variable template
│   └── server.js             # Entry point
│
├── frontend/                 # React + TypeScript SPA
│   ├── src/
│   │   ├── components/       # UI components (admin, auth, common, layout, ui)
│   │   ├── config/           # Axios instance
│   │   ├── contexts/         # AuthContext
│   │   ├── hooks/            # useToast, useForm, useCustomCode
│   │   ├── pages/            # Public pages + admin pages
│   │   ├── services/         # API service layer
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Image URL helpers
│   ├── .env.example          # Environment variable template
│   └── vite.config.ts
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- An SMTP email account (for OTP verification and newsletters)

---

### 1. Clone the repository

```bash
git clone https://github.com/SirajAhmed89/mern-blog-website.git
cd mern-blog-website
```

---

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/blog
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@email.com
SMTP_PASS=your_smtp_password
EMAIL_FROM=your@email.com
EMAIL_FROM_NAME=Your Blog Name
```

```bash
# Create the superadmin account
npm run create:superadmin

# (Optional) Seed sample data
npm run seed

# Start development server
npm run dev
```

Backend runs on **http://localhost:5000**

---

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 🔐 RBAC — Roles & Permissions

| Role | Access |
|------|--------|
| **Superadmin** | Full access to everything |
| **Admin** | Access controlled by assigned permissions |

### Available Permissions

| Group | Permissions |
|-------|-------------|
| Posts | `posts.view` `posts.create` `posts.edit` `posts.delete` `posts.publish` |
| Users | `users.view` `users.create` `users.edit` `users.delete` `users.ban` |
| Categories | `categories.view` `categories.create` `categories.edit` `categories.delete` |
| Tags | `tags.view` `tags.create` `tags.edit` `tags.delete` |
| Comments | `comments.view` `comments.moderate` `comments.delete` |
| Dashboard | `dashboard.analytics` `dashboard.reports` `dashboard.settings` |

---

## 🌐 API Overview

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/otp/verify` | Public |
| GET | `/api/posts` | Public |
| GET | `/api/posts/slug/:slug` | Public |
| GET | `/api/posts/featured-hero` | Public |
| POST | `/api/posts` | `posts.create` |
| PUT | `/api/posts/:id` | `posts.edit` |
| DELETE | `/api/posts/:id` | `posts.delete` |
| GET | `/api/categories` | Public |
| GET | `/api/tags` | Public |
| GET | `/api/comments/:postId` | Public |
| POST | `/api/comments` | Public (guest or auth) |
| GET | `/api/settings` | Public |
| PUT | `/api/settings` | `dashboard.settings` |
| GET | `/api/analytics/dashboard` | `dashboard.analytics` |
| POST | `/api/admin/create` | Superadmin |
| GET | `/api/admin/list` | Superadmin |
| PUT | `/api/admin/:id/permissions` | Superadmin |
| POST | `/api/upload/image` | Authenticated |
| GET | `/api/newsletter` | Admin |
| POST | `/api/newsletter/subscribe` | Public |

---

## 🏗️ Tech Stack

### Backend
| Package | Purpose |
|---------|---------|
| Express 4 | Web framework |
| Mongoose 8 | MongoDB ODM |
| jsonwebtoken | JWT auth |
| bcryptjs | Password hashing |
| multer | File uploads |
| nodemailer | Email sending |
| helmet | Security headers |
| express-rate-limit | Rate limiting |
| express-mongo-sanitize | NoSQL injection prevention |
| express-validator | Input validation |

### Frontend
| Package | Purpose |
|---------|---------|
| React 19 | UI library |
| TypeScript 5.9 | Type safety |
| Vite 7 | Build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Routing |
| Axios | HTTP client |
| TipTap 3 | Rich text editor |
| Sonner | Toast notifications |
| React Hook Form | Form management |
| @heroicons/react | Icons |

---

## 📦 Production Build

```bash
# Build frontend
cd frontend
npm run build
# Output: frontend/dist/

# Start backend in production
cd backend
NODE_ENV=production npm start
```

---

## 🛡️ Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWTs (min 32 chars) |
| `JWT_EXPIRE` | No | Token expiry (default: 7d) |
| `NODE_ENV` | No | `development` or `production` |
| `CLIENT_URL` | ✅ | Frontend URL for CORS |
| `SMTP_HOST` | ✅ | SMTP server hostname |
| `SMTP_PORT` | ✅ | SMTP port (465 or 587) |
| `SMTP_SECURE` | ✅ | `true` for port 465, `false` for 587 |
| `SMTP_USER` | ✅ | SMTP username / email |
| `SMTP_PASS` | ✅ | SMTP password |
| `EMAIL_FROM` | ✅ | Sender email address |
| `EMAIL_FROM_NAME` | No | Sender display name |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API base URL |

---

## 📝 Scripts

### Backend
```bash
npm run dev              # Start with nodemon (hot reload)
npm start                # Start production server
npm run create:superadmin  # Interactive superadmin creation
npm run seed             # Seed sample posts, categories, tags
npm run setup:db         # Initialize database indexes
```

### Frontend
```bash
npm run dev              # Start Vite dev server
npm run build            # TypeScript check + production build
npm run lint             # ESLint
npm run preview          # Preview production build locally
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

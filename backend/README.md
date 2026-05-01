# Backend API - MERN Blog Platform

A robust REST API built with Node.js, Express, and MongoDB, featuring comprehensive RBAC (Role-Based Access Control) system.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **RBAC System** - Superadmin, Admin, Author, Reader roles with 26 granular permissions
- **Blog Management** - Posts, categories, tags, comments
- **File Upload** - Image upload for posts and avatars
- **Security** - Helmet, CORS, rate limiting, input sanitization
- **Validation** - Request validation with express-validator
- **Error Handling** - Centralized error handling

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Test database connection
npm run test:db

# Setup database
npm run setup:db

# Seed sample data (optional)
npm run seed

# Create superadmin account
npm run create:superadmin
```

## 🚀 Running

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Auth, validation, error handling
├── models/          # MongoDB models
├── routes/          # API routes
├── scripts/         # Utility scripts
├── services/        # Business logic
├── utils/           # Helper functions
├── validators/      # Input validation
└── server.js        # Entry point
```

## 🌐 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Admin Management (Superadmin Only)
- `POST /api/admin/create` - Create admin
- `GET /api/admin/list` - List admins
- `PUT /api/admin/:id/permissions` - Update permissions
- `PUT /api/admin/:id/activate` - Activate admin
- `PUT /api/admin/:id/deactivate` - Deactivate admin

### Content (Permission-based)
- `GET /api/posts` - List posts (public)
- `POST /api/posts` - Create post (requires: posts.create)
- `PUT /api/posts/:id` - Update post (requires: posts.edit)
- `DELETE /api/posts/:id` - Delete post (requires: posts.delete)

Similar endpoints for categories, tags, and comments.

## 🔐 RBAC System

### Roles
- **Superadmin** - Full system access
- **Admin** - Permission-based access
- **Author** - Create and manage own content
- **Reader** - Basic read access

### Permissions (26 total)
- **Posts** (5): view, create, edit, delete, publish
- **Users** (5): view, create, edit, delete, ban
- **Categories** (4): view, create, edit, delete
- **Tags** (4): view, create, edit, delete
- **Comments** (3): view, moderate, delete
- **Dashboard** (3): analytics, reports, settings
- **Media** (2): upload, delete

## 📚 Documentation

- **MONGODB_SETUP.md** - MongoDB configuration
- **RBAC_GUIDE.md** - Complete RBAC guide
- **ADMIN_API_REFERENCE.md** - Admin API reference
- **RBAC_ARCHITECTURE.md** - Architecture diagrams

## 🔧 Scripts

- `npm run dev` - Development server
- `npm start` - Production server
- `npm run test:db` - Test database
- `npm run setup:db` - Setup database
- `npm run seed` - Seed data
- `npm run verify` - Verify setup
- `npm run create:superadmin` - Create superadmin

## 🛡️ Security

- JWT authentication
- bcrypt password hashing
- Helmet security headers
- CORS configuration
- Rate limiting on auth
- MongoDB injection prevention
- Input validation

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## 🧪 Testing

```bash
# Test database connection
npm run test:db

# Verify setup
npm run verify
```

## 📦 Main Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT auth
- express-validator - Validation
- helmet - Security
- cors - CORS
- multer - File upload

## 📞 Support

For issues, check the documentation or create an issue in the repository.

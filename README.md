<<<<<<< HEAD
# Sweet Shop Management System

A simplified full-stack web application for managing a sweet shop with customer browsing, purchasing, and admin inventory management features. Built according to the core requirements with user authentication, sweet catalog management, search functionality, and inventory operations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A PostgreSQL database (optional - app works with in-memory storage)

### 1. Installation & Setup

```bash
# Install dependencies
npm install

# Optional: Configure database
# Copy .env.example to .env and add your DATABASE_URL
# npm run db:push
# npm run seed

# Start the development server
npm run dev
```

### 2. Access the Application

- Open your browser to `http://localhost:5000`
- Use these test accounts:
  - **Admin**: `admin` / `admin123`
  - **Customer**: `user` / `user123`

## 🎯 Core Features

### Customer Features
- 🍭 Browse sweet catalog with detailed cards
- 🔍 Search and filter sweets by name, category, price range (₹)
- 🛒 Purchase sweets (automatically updates inventory)
- 👤 User authentication and registration
- 📱 Responsive design

### Admin Features
- 📊 Inventory management dashboard
- ➕ Add new sweets to catalog
- 📦 Restock existing items
- 🗑️ Delete sweets from inventory
- 👑 Admin-only access controls

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript, JWT Authentication
- **Database**: PostgreSQL with Drizzle ORM (in-memory fallback)
- **State Management**: TanStack Query
- **Build Tool**: Vite
- **Routing**: Wouter

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user info

### Sweets Management
- `GET /api/sweets` - Get all sweets (supports filtering)
- `GET /api/sweets/search?q=query` - Search sweets
- `GET /api/sweets/:id` - Get specific sweet
- `POST /api/sweets` - Create sweet (admin only)
- `PUT /api/sweets/:id` - Update sweet (admin only)
- `DELETE /api/sweets/:id` - Delete sweet (admin only)

### Inventory Operations
- `POST /api/sweets/:id/purchase` - Purchase sweet (authenticated)
- `POST /api/sweets/:id/restock` - Restock sweet (admin only)

## 🗂️ Project Structure

```
SmartTherapyConnect/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── hooks/          # Custom hooks
├── server/                 # Express backend
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── seed.ts            # Database seeding
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema & types
└── package.json
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema changes to database
npm run seed         # Seed database with sample data
npm run test         # Run tests
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your-secure-jwt-secret"
PORT=5000
NODE_ENV=development
```

## 🎨 UI/UX Features

- **Clean Design**: Modern interface with Indian rupee (₹) pricing
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, loading states
- **Toast Notifications**: Real-time feedback for user actions
- **Role-based UI**: Different interfaces for customers vs admins
- **Search & Filters**: Advanced filtering with price ranges in ₹

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Admin-only routes and operations
- **Input Validation**: Comprehensive validation using Zod schemas
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for full-stack apps)
- Railway
- Render

Make sure to:
1. Set up your database in production
2. Configure environment variables
3. Run database migrations: `npm run db:push`
4. Seed initial data: `npm run seed`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📄 License

# indian-sweet-shops
>>>>>>> 44ed5a6f09016bce77d2478c75ae3ad0a166b410
MIT License - feel free to use this project for learning or commercial purposes.
=======
# indian-sweet-shops
>>>>>>> 44ed5a6f09016bce77d2478c75ae3ad0a166b410

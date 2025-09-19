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


### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your-secure-jwt-secret"
PORT=5000
NODE_ENV=development
```


## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

# 1. 🔐 User Authentication
✅ POST /api/auth/register
URL: http://localhost:5000/api/auth/register
Method: POST
Headers:
Content-Type: application/json
Body (raw JSON):
json
{
  "username": "testusers",
  "password": "password123",
  "role": "user"
}
<img width="849" height="914" alt="image" src="https://github.com/user-attachments/assets/ce210dd2-4596-42eb-afbc-4c3209b426b4" />



✅ POST /api/auth/login
URL: http://localhost:5000/api/auth/login
Method: POST
Headers:
Content-Type: application/json
Body (raw JSON):
```bash
json
{
  "username": "admin",
  "password": "admin123"
}
```
<img width="838" height="879" alt="image" src="https://github.com/user-attachments/assets/9da506c3-7691-4658-ba04-32d29a3ae791" />

# 2. 🍬 Sweets Management
✅ POST /api/sweets (Add Sweet)
URL: http://localhost:5000/api/sweets
Method: POST
Headers:
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
Body (raw JSON):
```bash
json
{
  "name": "Jalebi",
  "category": "Syrup Sweet",
  "price": "320.00",
  "quantity": 50,
  "description": "Crispy spiral sweet soaked in sugar syrup",
  "reorderPoint": 10
}
```

<img width="830" height="865" alt="image" src="https://github.com/user-attachments/assets/d8ff0ea5-1921-4190-80d6-c3f677497be3" />

✅ GET /api/sweets (Fetch All Sweets)
URL: http://localhost:5000/api/sweets
Method: GET
Headers: None required
Body: None

<img width="837" height="901" alt="image" src="https://github.com/user-attachments/assets/70a575bc-f572-4f0c-b2fd-9df6f36353da" />


✅ GET /api/sweets/search (Search Sweets)
URL: http://localhost:5000/api/sweets/search?q=kaju
Method: GET
Headers: None required
Body: None

<img width="802" height="899" alt="image" src="https://github.com/user-attachments/assets/72c18036-fc91-4994-bd36-660144d24f5b" />



✅ PUT /api/sweets/:id (Update Sweet)
URL: http://localhost:5000/api/sweets/1
Method: PUT
Headers:
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Body (raw JSON):
```bash
json
{
  "name": "Premium Kaju Katli",
  "price": "999.00",
  "quantity": 30,
  "description": "Premium cashew diamond-shaped sweet with silver foil - Updated!"
}
```
<img width="800" height="802" alt="image" src="https://github.com/user-attachments/assets/f79735a6-aad4-49c4-8c49-570684b02eb2" />


✅ DELETE /api/sweets/:id (Delete Sweet)
URL: http://localhost:5000/api/sweets/1
Method: DELETE
Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Body: NoneTest with Admin token - Should succeed
Test with User token - Should return 403 Forbidden

- admin
<img width="825" height="787" alt="image" src="https://github.com/user-attachments/assets/e2576b23-a5f0-47e8-8026-17dded55cdee" />

- user
<img width="827" height="749" alt="image" src="https://github.com/user-attachments/assets/b4fde0e9-c319-4b46-979e-425f60f1f1ad" />



# 3. 📦 Inventory Management
✅ POST /api/sweets/:id/purchase (Purchase Sweet)
First, GET the sweet to see current quantity:
URL: http://localhost:5000/api/sweets/4
Method: GETThen purchase:
URL: http://localhost:5000/api/sweets/4/purchase
Method: POST
Headers:
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
Body (raw JSON):
```bash
json
{
  "quantity": 2
}
```

<img width="816" height="671" alt="image" src="https://github.com/user-attachments/assets/1c3cec46-1240-4f9b-b251-f81e7240baf7" />

# 📝 Testing Flow Recommendations
Step 1: Authentication
Register a new user
Login as admin to get admin token
Login as regular user to get user token
Step 2: Sweet Management (Admin only)
Add a new sweet with admin token
Get all sweets to see the new sweet
Search for sweets
Update the sweet details
Try to delete with user token (should fail)
Delete with admin token (should succeed)
Step 3: Inventory Operations
Get a sweet's current quantity
Purchase some items (reduces quantity)
Get the sweet again to confirm quantity reduction
Try to restock with user token (should fail)
Restock with admin token (should succeed)


LOGIN/SIGNIN PAGE:
<img width="1255" height="711" alt="image" src="https://github.com/user-attachments/assets/90c3aa44-cb60-4ead-988a-38ae0f1e95eb" />


# DASHBOARD SCREENSHOT:
<img width="1847" height="809" alt="image" src="https://github.com/user-attachments/assets/aa436d88-e8e5-495c-adda-927318720026" />

# ADD sweets under ADMIN login only 
<img width="850" height="635" alt="image" src="https://github.com/user-attachments/assets/a079ba21-1e1d-47ab-8e1d-e6f74a119c10" />


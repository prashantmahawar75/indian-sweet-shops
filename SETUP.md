# Sweet Shop Management System Setup

## Database Setup (Neon PostgreSQL)

1. **Create a Neon Account**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account
   - Create a new project

2. **Get Your Database Connection String**
   - In your Neon dashboard, go to your project
   - Click on "Connection Details"
   - Copy the connection string (it looks like: `postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require`)

3. **Set Up Environment Variables**
   - Copy `.env.example` to `.env`
   - Replace the `DATABASE_URL` with your Neon connection string
   - Update the `JWT_SECRET` with a secure random string

4. **Push Database Schema**
   ```bash
   npm run db:push
   ```

5. **Seed the Database (Optional)**
   ```bash
   npm run seed
   ```

## Running the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open your browser to `http://localhost:5000`
   - Use the following test accounts:
     - Admin: `admin` / `admin123`
     - User: `user` / `user123`

## Features

- **Customer Features:**
  - Browse sweet catalog
  - Search and filter sweets
  - Purchase sweets (reduces inventory)
  - User authentication

- **Admin Features:**
  - Manage inventory
  - Add new sweets
  - Restock items
  - View low stock alerts
  - Delete sweets

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Sweets
- `GET /api/sweets` - Get all sweets (with filters)
- `GET /api/sweets/search` - Search sweets
- `GET /api/sweets/:id` - Get specific sweet
- `POST /api/sweets` - Create sweet (admin only)
- `PUT /api/sweets/:id` - Update sweet (admin only)
- `DELETE /api/sweets/:id` - Delete sweet (admin only)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (admin only)
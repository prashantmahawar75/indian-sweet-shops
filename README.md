# Indian Sweet Shop Management System

A full-stack web application for managing an Indian sweet shop with customer browsing, purchasing, and admin inventory management features. The application features authentic Indian sweets like Kaju Katli, Moong Dal Burfi, Kalakand, and more with pricing in Indian Rupees (INR).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Neon PostgreSQL database account (optional - app works with in-memory storage)

### 1. Database Setup (Optional - Neon PostgreSQL)

1. **Create a Neon Account**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account
   - Create a new project

2. **Get Your Database Connection String**
   - In your Neon dashboard, go to your project
   - Navigate to "Connection Details" or "Dashboard"
   - Copy the connection string (format: `postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require`)

3. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and replace DATABASE_URL with your Neon connection string
   # Also update JWT_SECRET with a secure random string
   ```

### 2. Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd SmartTherapyConnect

# Install dependencies
npm install

# Optional: Push database schema to Neon (if using database)
npm run db:push

# Optional: Seed the database with sample data (if using database)
npm run seed

# Start the development server
npm run dev
```

### 3. Access the Application

- Open your browser to `http://localhost:5000`
- Use these test accounts:
  - **Admin**: `admin` / `admin123`
  - **Customer**: `user` / `user123`

## 🎯 Features

### Customer Features
- 🍭 Browse Indian sweet catalog with beautiful cards
- 🔍 Search and filter sweets by name, category, price (INR)
- 🛒 Purchase sweets (automatically updates inventory)
- 👤 User authentication and registration
- 📱 Responsive design for all devices

### Admin Features
- 📊 Inventory management dashboard
- ➕ Add new sweets to catalog
- 📦 Restock existing items
- ⚠️ Low stock alerts
- 🗑️ Delete sweets from inventory
- 👑 Admin-only access controls

## 🍬 Available Indian Sweets

The application features authentic Indian sweets:

- **Kaju Katli** (₹899) - Premium cashew diamond-shaped sweet with silver foil
- **Moong Dal Burfi** (₹650) - Traditional moong dal sweet with cardamom and ghee
- **Kalakand** (₹750) - Soft milk-based sweet with cardamom and pistachios
- **Gulab Jamun** (₹450) - Soft milk dumplings soaked in rose-cardamom syrup
- **Rasgulla** (₹380) - Spongy cottage cheese balls in sugar syrup
- **Besan Laddu** (₹520) - Traditional gram flour laddu with ghee and cardamom
- **Mysore Pak** (₹680) - Rich ghee-based sweet from Karnataka
- **Sandesh** (₹420) - Bengali cottage cheese sweet with cardamom

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript, JWT Authentication
- **Database**: PostgreSQL (Neon), Drizzle ORM (with in-memory fallback)
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
npm run check        # TypeScript type checking
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your-secure-jwt-secret"
PORT=5000
NODE_ENV=development
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, attractive interface with gradient backgrounds
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, loading states, animations
- **Toast Notifications**: Real-time feedback for user actions
- **Role-based UI**: Different interfaces for customers vs admins
- **Search & Filters**: Advanced filtering with real-time results
- **Indian Currency**: All prices displayed in Indian Rupees (₹)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Admin-only routes and operations
- **Input Validation**: Comprehensive validation using Zod schemas
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM

## 📊 Database Schema

The application uses a well-designed PostgreSQL schema with:

- **Users**: Authentication and role management
- **Sweets**: Product catalog with pricing in INR and inventory
- **Orders**: Purchase tracking and history
- **Order Items**: Detailed line items for orders
- **Inventory Adjustments**: Complete audit trail for stock changes

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for full-stack apps)
- Netlify
- Railway
- Render

Make sure to:
1. Set up your Neon database in production
2. Configure environment variables
3. Run database migrations: `npm run db:push`
4. Seed initial data: `npm run seed`

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

The application includes comprehensive tests for:
- Authentication flows
- API endpoints
- Database operations
- Component functionality

## 📸 Screenshots

### Homepage - Indian Sweet Catalog
![Sweet Catalog](./screenshots/homepage.png)
*Browse authentic Indian sweets with prices in INR*

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Manage inventory and add new sweets*

### Login Interface
![Login](./screenshots/login.png)
*Clean and intuitive authentication*

### Sweet Details
![Sweet Details](./screenshots/sweet-details.png)
*Detailed view of individual sweets*

## 🤖 My AI Usage

### AI Tools Used

1. **Qoder AI Assistant** - Primary development assistant
2. **GitHub Copilot** - Code completion and suggestions
3. **ChatGPT** - Architecture planning and documentation

### How I Used AI Tools

#### Qoder AI Assistant
- **Code Generation**: Used Qoder to generate the initial project structure, including React components, Express.js routes, and database schema
- **Bug Fixing**: When encountering database connection issues, Qoder helped implement a fallback in-memory storage system
- **Feature Implementation**: Assisted in implementing authentication, inventory management, and search functionality
- **Code Refactoring**: Helped convert from generic sweet shop to Indian-specific sweets with INR pricing
- **Documentation**: Generated comprehensive README documentation and API endpoint descriptions

#### GitHub Copilot
- **Type Definitions**: Auto-completed TypeScript interfaces and type definitions for the database schema
- **Test Cases**: Generated unit test templates for authentication and API endpoints
- **Form Validation**: Suggested Zod schema validation patterns for user input
- **CSS Styling**: Provided Tailwind CSS class suggestions for responsive design

#### ChatGPT
- **Architecture Planning**: Brainstormed the overall system architecture and technology stack decisions
- **API Design**: Discussed RESTful API endpoint structure and naming conventions
- **Database Schema**: Planned the relational database structure for users, sweets, orders, and inventory
- **Security Best Practices**: Researched JWT implementation and password hashing strategies

### Reflection on AI Impact

#### Positive Impacts
1. **Accelerated Development**: AI tools reduced development time by approximately 60-70%
2. **Reduced Boilerplate**: Automated generation of repetitive code like CRUD operations and form components
3. **Enhanced Code Quality**: AI suggestions often included best practices and error handling I might have missed
4. **Learning Acceleration**: Exposure to new patterns and libraries through AI recommendations
5. **Documentation Efficiency**: AI helped create comprehensive documentation faster than manual writing

#### Challenges and Limitations
1. **Context Understanding**: Sometimes AI suggestions didn't fully understand the specific business requirements
2. **Over-reliance Risk**: Had to be careful not to accept suggestions without understanding the underlying logic
3. **Debugging Complexity**: AI-generated code sometimes required additional debugging and refinement
4. **Security Considerations**: Had to verify that AI-suggested security implementations followed best practices

#### Best Practices Developed
1. **Iterative Refinement**: Used AI for initial implementation, then manually refined for specific requirements
2. **Code Review**: Always reviewed AI-generated code line by line before integration
3. **Testing First**: Wrote tests to validate AI-generated functionality
4. **Documentation**: Maintained clear documentation of AI-assisted vs manually written code

#### Workflow Integration
1. **Planning Phase**: Used ChatGPT for architecture brainstorming and requirement analysis
2. **Development Phase**: Leveraged Qoder and Copilot for rapid prototyping and implementation
3. **Testing Phase**: AI helped generate test cases but manual verification was essential
4. **Documentation Phase**: AI accelerated documentation creation while ensuring accuracy

The AI tools significantly enhanced my productivity and code quality, but human oversight and domain expertise remained crucial for delivering a production-ready application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

**Happy Sweet Shopping! 🍬**
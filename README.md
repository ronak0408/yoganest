# 🧘 YogaNest - Full-Stack Wellness Platform

A modern, production-ready web application for guided yoga modules, personalized recommendations, and AI-based posture tracking.

## 🚀 Features

- **10+ Guided Yoga Modules** - Organized by category (Flexibility, Strength, Relaxation, Balance, Meditation, Energy)
- **User Authentication** - JWT-based login/signup with bcrypt password hashing
- **AI Recommendations** - Rule-based engine considering user level, preferences, and time of day
- **Posture Tracking** - Simulated AI posture feedback with real-time guidance
- **Progress Tracking** - Track completed sessions and personal stats
- **Favorites** - Bookmark yoga sessions
- **Dark Mode** - Full dark mode support
- **Responsive Design** - Mobile, tablet, and desktop optimized

## 🛠️ Tech Stack

**Frontend:**
- React.js 18 with Hooks and Context API
- Tailwind CSS with custom theme
- React Router v6

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation

## 📁 Project Structure

```
yoganest/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # PrivateRoute, LoadingSpinner, DifficultyBadge
│   │   │   ├── dashboard/     # RecommendationCard
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── posture/       # PostureFeedback
│   │   │   └── yoga/          # YogaCard, CategoryFilter
│   │   ├── context/           # AuthContext
│   │   ├── hooks/             # useDarkMode, useYogaModules
│   │   ├── pages/             # Home, Dashboard, Modules, ModuleDetail,
│   │   │                      # PostureTracking, Profile, Login, Signup
│   │   └── utils/             # api.js (Axios instance)
│   └── package.json
├── server/                    # Express backend
│   ├── config/                # Rate limiter
│   ├── controllers/           # authController, yogaController,
│   │                          # recommendationsController, userController
│   ├── data/                  # yogaModules.js seed data, seeder.js
│   ├── middleware/            # auth.js (JWT), errorHandler.js
│   ├── models/                # User.js, YogaModule.js
│   ├── routes/                # auth.js, yoga.js, recommendations.js, user.js
│   └── server.js
└── README.md
```

## 📋 Getting Started

### Prerequisites

- Node.js v16+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/ronak0408/yoganest.git
cd yoganest
```

### 2. Set Up the Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yoganest
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

**Seed the database with yoga modules:**
```bash
npm run seed
```

**Start the server:**
```bash
npm run dev    # development with nodemon
# or
npm start      # production
```

### 3. Set Up the Frontend

```bash
cd client
npm install
```

**Start the React app:**
```bash
npm start
```

The app will open at `http://localhost:3000`. The React dev server proxies API calls to `http://localhost:5000`.

### 4. Running Both Together

Open two terminals:
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get current user | Yes |
| GET | `/api/yoga/modules` | Get all yoga modules | No |
| GET | `/api/yoga/modules/:id` | Get single module | No |
| GET | `/api/recommendations` | Get personalized recommendations | Yes |
| POST | `/api/user/favorites` | Toggle favorite module | Yes |
| GET | `/api/user/favorites` | Get user's favorites | Yes |
| GET | `/api/user/progress` | Get progress data | Yes |
| POST | `/api/user/progress` | Mark module as complete | Yes |
| PUT | `/api/user/preferences` | Update user preferences | Yes |

## 🧘 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with features overview |
| Login | `/login` | User authentication |
| Signup | `/signup` | New user registration |
| Dashboard | `/dashboard` | Personalized recommendations & stats |
| Modules | `/modules` | Browse all yoga modules with filters |
| Module Detail | `/modules/:id` | Full module info with steps |
| Posture Tracker | `/posture` | Simulated AI posture feedback |
| Profile | `/profile` | User settings & preferences |

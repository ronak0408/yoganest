# YogaNest - Full-Stack Wellness Platform

A modern, production-ready web application for guided yoga modules, personalized recommendations, and AI-based posture tracking.

## 🚀 Features

- **12 guided yoga modules** across 6 categories (Flexibility, Strength, Relaxation, Balance, Meditation, Energy)
- **User authentication** with JWT (register, login, profile)
- **Personalized AI recommendations** based on skill level, activity history, and time-of-day
- **Simulated posture tracking** with real-time feedback and accuracy meter
- **Progress tracking** — session history, total minutes, streak
- **Favorites/bookmarks** for yoga sessions
- **Dark mode** toggle
- **Fully responsive** (mobile, tablet, desktop)

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS 3, React Router v6, Axios |
| Backend | Node.js, Express 4, express-rate-limit |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |

## 📁 Project Structure

```
yoganest/
├── client/                    # React frontend
│   ├── public/
│   └── src/
│       ├── components/        # Navbar, Footer, YogaCard, ProtectedRoute, LoadingSpinner
│       ├── context/           # AuthContext, ThemeContext
│       ├── hooks/             # useAuth, useTheme
│       ├── pages/             # Home, Login, Register, Dashboard, Modules, ModuleDetail,
│       │                      # PostureTracking, Profile
│       ├── utils/             # api.js (Axios instance)
│       └── App.js
├── server/                    # Express backend
│   ├── controllers/           # authController, yogaController, recommendationController, userController
│   ├── data/                  # yogaModules.js (seed data), seed.js
│   ├── middleware/            # auth.js (JWT guard)
│   ├── models/                # User.js, YogaModule.js
│   ├── routes/                # authRoutes, yogaRoutes, recommendationRoutes, userRoutes
│   └── server.js
└── README.md
```

## 📋 Getting Started

### Prerequisites

- **Node.js** v16+
- **MongoDB** (local install or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** v8+

### 1. Clone the repository

```bash
git clone https://github.com/ronak0408/yoganest.git
cd yoganest
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yoganest
JWT_SECRET=change_this_to_a_long_random_secret
NODE_ENV=development
```

Install dependencies and seed the database:

```bash
npm install
npm run seed
```

### 3. Start the backend

```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

The API will be available at `http://localhost:5000`.

### 4. Start the frontend

In a new terminal:

```bash
cd client
npm install
npm start
```

The React app will open at `http://localhost:3000` and proxy API calls to port 5000.

## 🔌 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login and receive JWT |
| GET | `/api/auth/profile` | ✓ | Get current user profile |
| GET | `/api/yoga/modules` | — | List all modules (`?category=X&difficulty=Y`) |
| GET | `/api/yoga/modules/:id` | — | Get single module |
| GET | `/api/recommendations` | ✓ | Get personalized recommendations |
| POST | `/api/user/favorites` | ✓ | Toggle favorite module |
| GET | `/api/user/favorites` | ✓ | List favorited modules |
| POST | `/api/user/progress` | ✓ | Log a completed session |
| GET | `/api/user/progress` | ✓ | Get progress stats |
| GET | `/api/health` | — | Health check |

## 🧘 Features Overview

### Yoga Modules
Browse 12 categorized sessions with difficulty badges, duration, calories, and ratings.

### Dashboard
Personalized home for authenticated users — recommendations, recent activity, and quick stats.

### AI Recommendations
Rule-based engine factors in:
- User's skill level
- Previously completed sessions (de-duplication)
- Time-of-day preference (Morning → Energy/Flexibility, Evening → Relaxation/Meditation)

### Posture Tracking
Simulated posture analysis with pose selector, accuracy meter, and cycling feedback messages.

### Dark Mode
One-click toggle persisted in `localStorage`; uses Tailwind's `dark:` variant classes throughout.

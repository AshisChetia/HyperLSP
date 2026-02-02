# 🛠️ HyperLSP - Hyperlocal Service Provider Marketplace

A full-stack web application connecting customers with local service providers for home services like plumbing, electrical work, cleaning, and more.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## ✨ Features

### For Customers
- 🔍 Browse and search service providers by category
- 📍 Find nearby providers based on pincode
- 📅 Book services with preferred date & time
- 💰 Propose your own price for services
- ⭐ Rate and review completed services
- 📋 Track booking history and status

### For Service Providers
- 🏪 Create and manage service listings
- 📊 Dashboard with booking analytics
- ✅ Accept/reject booking requests
- 💵 View earnings and performance stats
- 🔔 Manage customer bookings

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, TailwindCSS 4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Styling | Glassmorphism, Dark Theme |

## 📁 Project Structure

```
HyperLSP/
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── public/      # Landing, Login, Signup
│   │   │   ├── user/        # Customer pages
│   │   │   └── provider/    # Provider pages
│   │   ├── services/
│   │   │   └── api.js       # API service layer
│   │   └── App.jsx          # Routes
│   └── package.json
│
└── Backend/
    ├── Controllers/         # Business logic
    ├── Models/              # MongoDB schemas
    ├── Routes/              # API endpoints
    ├── Middlewares/         # Auth middleware
    ├── config/              # Database config
    └── server.js            # Entry point
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/HyperLSP.git
cd HyperLSP
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd Frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

Start the app:
```bash
npm run dev
```

## 🌐 Deployment

### Backend (Cyclic.sh)
1. Push code to GitHub
2. Connect repo to [Cyclic.sh](https://cyclic.sh)
3. Set root directory: `Backend`
4. Add environment variables

### Frontend (Vercel)
1. Import repo on [Vercel](https://vercel.com)
2. Set root directory: `Frontend`
3. Add `VITE_API_URL` environment variable

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup/user` | Register customer |
| POST | `/api/auth/signup/provider` | Register provider |
| POST | `/api/auth/login/user` | Customer login |
| POST | `/api/auth/login/provider` | Provider login |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services/categories` | Get all categories |
| GET | `/api/services/my-services` | Get provider's services |
| POST | `/api/services` | Add new service |
| PUT | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my-bookings` | Get user bookings |
| GET | `/api/bookings/requests` | Get provider requests |
| PUT | `/api/bookings/:id/accept` | Accept booking |
| PUT | `/api/bookings/:id/complete` | Complete booking |
| PUT | `/api/bookings/:id/rate` | Rate booking |

## 📸 Screenshots

### User Dashboard
Modern dark theme with glassmorphism effects, featuring nearby providers and quick booking access.

### Provider Dashboard
Analytics overview, booking management, and service listings with a premium UI design.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

⭐ Star this repo if you found it helpful!

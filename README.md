# 🏠 Airbnb Clone

A full-stack Airbnb clone built with React + Tailwind (frontend) and Node.js + Express + MongoDB (backend).

## Features
- ✅ User Auth (JWT — Guest & Host roles)
- ✅ Property Listings (Create, Read, Update, Delete)
- ✅ Search & Filters (location, price, guests, type)
- ✅ Booking System with date picker
- ✅ Stripe Payment Integration
- ✅ Reviews & Ratings
- ✅ Host Dashboard
- ✅ RapidAPI Airbnb Search Integration

---

## Project Structure
```
airbnb-clone/
├── client/        # React + Tailwind (Vite)
└── server/        # Node.js + Express + MongoDB
```

---

## Setup

### 1. Server Setup
```bash
cd server
cp .env.example .env     # Fill in your credentials
npm install
npm run dev              # Runs on http://localhost:5000
```

### 2. Client Setup
```bash
cd client
cp .env.example .env     # Fill in Stripe public key
npm install
npm run dev              # Runs on http://localhost:5173
```

---

## Environment Variables

### Server (`server/.env`)
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Any random secret string |
| `CLOUDINARY_*` | Cloudinary credentials (image uploads) |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_...) |
| `RAPIDAPI_KEY` | RapidAPI key for Airbnb search |

### Client (`client/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key (pk_test_...) |

---

## Getting API Keys

### MongoDB Atlas (Free)
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Click Connect → Get connection string

### Cloudinary (Free)
1. Go to https://cloudinary.com
2. Sign up → Dashboard → Copy credentials

### Stripe (Test Mode)
1. Go to https://stripe.com
2. Sign up → Developers → API Keys
3. Use test keys (pk_test_... / sk_test_...)
4. Test card: `4242 4242 4242 4242`

### RapidAPI (Airbnb Search)
1. Go to https://rapidapi.com/ntd119/api/airbnb-search
2. Sign up → Subscribe to free plan
3. Copy your `X-RapidAPI-Key`

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Listings
- `GET /api/listings` — Get all (with filters)
- `GET /api/listings/:id` — Get one
- `POST /api/listings` — Create (host only)
- `PUT /api/listings/:id` — Update (host only)
- `DELETE /api/listings/:id` — Delete (host only)

### Bookings
- `POST /api/bookings` — Create booking
- `GET /api/bookings/my` — My bookings
- `PUT /api/bookings/:id/cancel` — Cancel

### Reviews
- `POST /api/reviews` — Create review
- `GET /api/reviews/:listingId` — Get listing reviews

### Payments
- `POST /api/payments/create-intent` — Create Stripe intent
- `POST /api/payments/confirm` — Confirm payment

### Host
- `GET /api/host/stats` — Dashboard stats
- `GET /api/host/bookings` — Host bookings

### Search (RapidAPI)
- `GET /api/search?location=Paris&checkIn=2024-06-01&checkOut=2024-06-05`

---

## Deploy

### Frontend → Vercel
```bash
cd client && npm run build
# Upload to Vercel
```

### Backend → Render
```bash
# Connect GitHub repo to Render
# Set environment variables in Render dashboard
# Deploy!
```

# Event Next Door - Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase Account

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Navigate to the SQL Editor and run the SQL from `backend/config/database.sql` to create the tables

### 3. Environment Configuration
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout (requires token)

### Events Endpoints
- `GET /api/events` - Get all events (with pagination and filtering)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event (requires token)
- `PUT /api/events/:id` - Update event (requires token)
- `DELETE /api/events/:id` - Delete event (requires token)

### Bookings Endpoints
- `GET /api/bookings` - Get user bookings (requires token)
- `POST /api/bookings` - Create booking (requires token)
- `PUT /api/bookings/:id/cancel` - Cancel booking (requires token)
- `GET /api/bookings/event/:eventId/attendees` - Get event attendees (requires token)

## Folder Structure
```
backend/
├── config/
│   ├── supabase.js      # Supabase client configuration
│   └── database.sql     # Database schema
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   └── bookingController.js
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── bookingRoutes.js
└── index.js             # Main server file
```

## Frontend Integration
Update your frontend API calls to use the new backend endpoints:
```javascript
const API_URL = 'http://localhost:5000/api';

// Example: Login
fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

## Troubleshooting

### Port Already in Use
Change the PORT in `.env` file

### Supabase Connection Issues
- Verify your SUPABASE_URL and SUPABASE_ANON_KEY are correct
- Check that your Supabase project is active

### CORS Errors
- Make sure CORS_ORIGIN in `.env` matches your frontend URL
- Update the CORS origin in `backend/index.js` if needed

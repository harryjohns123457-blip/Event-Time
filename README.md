# Event Next Door

A full-stack event booking and discovery platform built with modern web technologies.

## Quick Start

### Prerequisites
- Node.js v14+
- npm or yarn
- Supabase account

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/harryjohns123457-blip/Event-Time.git
   cd Event-Time
   ```

2. **Backend Setup**
   ```bash
   cd "Event next door"
   npm install
   cp .env.example .env
   ```

3. **Configure Environment**
   
   Edit `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Initialize Database**
   - Run the schema from `backend/config/database.sql` in Supabase SQL Editor

5. **Start Backend**
   ```bash
   npm run dev
   ```

## Project Structure

```
Event-Time/
├── Event next door/
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── index.js
│   │   └── package.json
│   ├── frontend/
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── event_list.html
│   │   ├── js/
│   │   └── css/
│   └── SETUP.md
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Bookings
- `GET /api/bookings` - Get my bookings
- `POST /api/bookings` - Book event
- `PUT /api/bookings/:id/cancel` - Cancel booking

## Database

Tables:
- Users
- Events
- Bookings
- Reviews
- Categories

## Security

- JWT Authentication
- Bcrypt Password Hashing
- Input Validation
- CORS Configuration

## Technology Stack

**Backend:** Node.js, Express.js, Supabase  
**Frontend:** HTML5, CSS3, JavaScript

## Features

- User Registration & Authentication
- Event Browsing with Search & Filter
- Event Booking System
- Responsive Design
- Form Validation

## Getting Started

1. Install dependencies: `npm install`
2. Configure environment variables
3. Run database setup
4. Start backend: `npm run dev`
5. Open frontend in browser

## Documentation

- Backend Setup: `Event next door/SETUP.md`
- Frontend Guide: `Event next door/FRONTEND_IMPLEMENTATION.md`
- Code Review: `Event next door/PROFESSIONAL_REVIEW.md`

## Support

Email: info@eventnextdoor.com  
Phone: +254 741 938 327

## License

ISC

---

**Status:** Production Ready  
**Version:** 1.0.0

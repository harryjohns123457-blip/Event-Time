# Event Next Door - Full Stack Event Booking Platform

## 🎉 Project Overview

Event Next Door is a complete full-stack event booking web application built with **HTML/CSS/JavaScript** frontend and **Node.js/Express/MongoDB** backend. It transforms a static event website into a dynamic, production-ready platform with user authentication, event management, and booking system.

## ✨ Features Implemented

### ✅ Authentication System
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Protected API routes
- Session management with localStorage
- Admin role support

### ✅ Event Management
- Browse all events with dynamic loading
- Filter events by category
- Search events by title
- View detailed event information
- Real-time seat availability
- Event pricing with discounts

### ✅ Booking System
- Create bookings with ticket types (Regular, VIP, VVIP)
- Prevent duplicate bookings
- Prevent overbooking (capacity management)
- View booking history
- Cancel bookings
- Automatic seat restoration on cancellation
- Unique booking IDs

### ✅ Admin Dashboard
- Create new events
- Update event details
- Delete events
- View all bookings
- Manage users

### ✅ Database Models
- **User**: Full name, email, phone, password (hashed), role, timestamps
- **Event**: Title, description, category, date, time, venue, capacity, pricing, organizer
- **Booking**: Booking ID, user, event, ticket type, quantity, price, status, M-PESA transaction ID

### ✅ API Endpoints (RESTful)

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - Logout user

**Events:**
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

**Bookings:**
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings/my-bookings` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (protected)
- `GET /api/bookings` - Get all bookings (admin only)

## 📁 Project Structure

```
event-next-door/
├── frontend/
│   ├── index.html                 # Landing page
│   ├── login.html                 # Login page
│   ├── register.html              # Registration page
│   ├── event_list.html            # Events listing
│   ├── content.html               # Event details & booking
│   ├── my-bookings.html           # User bookings
│   ├── css/
│   │   ├── next-door.css          # Landing page styles
│   │   ├── event_list.css         # Events list styles
│   │   └── content.css            # Event details & booking styles
│   └── js/
│       ├── api.js                 # API client functions
│       ├── auth.js                # Authentication logic
│       ├── events.js              # Events listing logic
│       ├── booking.js             # Booking logic
│       └── my-bookings.js         # User bookings logic
│
├── backend/
│   ├── config/
│   │   └── database.js            # MongoDB connection
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Event.js               # Event schema
│   │   └── Booking.js             # Booking schema
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── eventController.js     # Event management
│   │   └── bookingController.js   # Booking management
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── eventRoutes.js         # Event endpoints
│   │   └── bookingRoutes.js       # Booking endpoints
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── errorHandler.js        # Error handling
│   ├── scripts/
│   │   └── seed.js                # Database seeding
│   └── server.js                  # Express app entry point
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/mosoticharles2-dot/Event-time.git
cd Event-time
```

#### 2. Install Backend Dependencies
```bash
npm install
```

#### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/event-next-door
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

#### 4. Seed the Database
```bash
npm run seed
```

This creates:
- Admin user: `admin@eventdoor.com` / `Admin@123`
- 7 sample events with pricing and details

#### 5. Start the Backend Server
```bash
npm start
```

Server runs on: `http://localhost:5000`

#### 6. Start the Frontend
Open `frontend/index.html` in your browser or use a local server:
```bash
python -m http.server 3000
# or
cd frontend && python -m http.server 3000
```

Frontend runs on: `http://localhost:3000`

## 🔑 Admin Credentials

After running seed script:
- **Email:** `admin@eventdoor.com`
- **Password:** `Admin@123`

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+254741234567",
    "password": "SecurePass123",
    "passwordConfirm": "SecurePass123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get All Events
```bash
curl http://localhost:5000/api/events
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "eventId": "EVENT_ID",
    "ticketType": "VIP",
    "ticketQuantity": 2,
    "mpesaTransactionId": "ABC123XYZ"
  }'
```

## 🔒 Security Features

✅ JWT-based authentication
✅ Password hashing with bcryptjs
✅ Protected API routes
✅ Role-based authorization
✅ Input validation
✅ Error handling middleware
✅ CORS protection
✅ Environment variables for secrets

## 🔄 Frontend-Backend Integration

The frontend communicates with the backend via REST API:

1. **Auth Flow:**
   - User registers/logs in → Server returns JWT token
   - Token stored in localStorage
   - Token sent in Authorization header for protected requests

2. **Event Flow:**
   - Load events from `/api/events`
   - Display dynamically on page
   - Link to booking page with event ID in URL

3. **Booking Flow:**
   - User fills booking form
   - Frontend calculates total price
   - Submit to `/api/bookings`
   - Seats automatically updated

4. **User Experience:**
   - Real-time loading indicators
   - Toast notifications for feedback
   - Responsive design
   - Auto-redirect on auth state changes

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String ("user" | "admin"),
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  date: Date,
  time: String,
  venue: String,
  capacity: Number,
  availableSeats: Number,
  image: String,
  pricing: {
    regular: { price: Number, discountPrice: Number },
    vip: { price: Number, discountPrice: Number },
    vvip: { price: Number, discountPrice: Number }
  },
  organizer: ObjectId (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  bookingId: String (unique),
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  ticketType: String ("Regular" | "VIP" | "VVIP"),
  ticketQuantity: Number,
  totalPrice: Number,
  bookingStatus: String ("pending" | "confirmed" | "cancelled"),
  paymentStatus: String ("pending" | "completed" | "failed"),
  mpesaTransactionId: String,
  bookingDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Test User Registration
1. Go to `http://localhost:3000/frontend/register.html`
2. Fill in details and submit
3. Should redirect to events page

### Test Event Booking
1. Login with any account
2. Browse events
3. Click on event
4. Fill booking form
5. Submit with M-PESA transaction ID

### Test Admin Functions
1. Login with admin credentials
2. Can create/update/delete events from API

## 📱 Frontend File Structure

```
frontend/
├── index.html           - Landing page with hero section
├── login.html           - Combined login/register page
├── register.html        - Standalone registration
├── event_list.html      - Browse all events
├── content.html         - Single event details & booking
├── my-bookings.html     - User's booking history
├── css/
│   ├── next-door.css    - Dark theme, hero styling
│   ├── event_list.css   - Event grid layout
│   └── content.css      - Event details & forms
└── js/
    ├── api.js           - API client (fetch wrapper)
    ├── auth.js          - Auth UI & logic
    ├── events.js        - Events page logic
    ├── booking.js       - Booking form logic
    └── my-bookings.js   - Bookings list logic
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- For Atlas: Update connection string with credentials

### JWT Token Expired
- Clear localStorage and login again
- Token expires after 7 days (configurable)

### CORS Error
- Ensure FRONTEND_URL in .env matches your frontend URL
- Check backend CORS configuration

### Events Not Loading
- Verify backend is running on port 5000
- Check browser console for API errors
- Ensure database is seeded with `npm run seed`

## 📈 Performance Optimizations

✅ JWT tokens stored in localStorage (no server sessions needed)
✅ API queries optimized with Mongoose
✅ Indexed database fields for fast searches
✅ Pagination-ready API structure
✅ Image optimization with responsive design
✅ Minified CSS for fast loading

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, Render)
1. Push to GitHub
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel, Netlify)
1. Push to GitHub
2. Connect frontend folder
3. Set backend API URL
4. Deploy

## 📝 License

MIT License - Feel free to use and modify

## 👨‍💻 Author

**Charles Mwangi** - Full Stack Developer

## 📞 Support

Contact: 0790179791 or +254741938327

## 🎯 Future Enhancements

- [ ] Email notifications for bookings
- [ ] Payment gateway integration (Stripe, M-PESA)
- [ ] Advanced analytics dashboard
- [ ] Event recommendations
- [ ] User reviews and ratings
- [ ] Social media sharing
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] QR code ticket generation
- [ ] Multi-language support

---

**Status:** ✅ **Fully Functional and Production Ready**

All features implemented and tested. Ready for deployment!
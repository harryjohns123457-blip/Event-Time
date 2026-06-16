# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format

All responses are JSON:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}
}
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+254741234567",
  "password": "SecurePass123",
  "passwordConfirm": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+254741234567",
    "role": "user"
  }
}
```

### Login
```
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Get Profile
```
GET /auth/profile
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer TOKEN
```

---

## Event Endpoints

### Get All Events
```
GET /events
```

**Query Parameters:**
- `category` - Filter by category
- `search` - Search by title

**Example:**
```
GET /events?category=Trending&search=WRC
```

**Response:**
```json
{
  "success": true,
  "count": 7,
  "events": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "WRC Safari Rally 2026",
      "description": "Unforgettable Safari Rally Experience",
      "category": "Adventures, Tour & Photography",
      "date": "2026-03-15T00:00:00.000Z",
      "time": "08:00 AM",
      "venue": "Nairobi, Kenya",
      "capacity": 500,
      "availableSeats": 490,
      "image": "wrc safari rally.jpg",
      "pricing": {
        "regular": { "price": 2999, "discountPrice": 2499 },
        "vip": { "price": 3999, "discountPrice": 3499 },
        "vvip": { "price": 5999, "discountPrice": 5499 }
      },
      "organizer": {
        "_id": "507f1f77bcf86cd799439010",
        "fullName": "Event Admin",
        "email": "admin@eventdoor.com"
      },
      "isActive": true,
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-01T10:00:00.000Z"
    }
  ]
}
```

### Get Event by ID
```
GET /events/:id
```

**Response:**
```json
{
  "success": true,
  "event": { ... }
}
```

### Create Event (Admin Only)
```
POST /events
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
```json
{
  "title": "New Event",
  "description": "Event description",
  "category": "Trending",
  "date": "2026-12-25",
  "time": "10:00 AM",
  "venue": "Venue Name",
  "capacity": 1000,
  "image": "image_url.jpg",
  "pricing": {
    "regular": { "price": 1000, "discountPrice": 800 },
    "vip": { "price": 1500, "discountPrice": 1200 },
    "vvip": { "price": 2000, "discountPrice": 1800 }
  }
}
```

### Update Event (Admin Only)
```
PUT /events/:id
Authorization: Bearer ADMIN_TOKEN
```

**Body:**
Same as create event (partial update allowed)

### Delete Event (Admin Only)
```
DELETE /events/:id
Authorization: Bearer ADMIN_TOKEN
```

---

## Booking Endpoints

### Create Booking
```
POST /bookings
Authorization: Bearer USER_TOKEN
```

**Body:**
```json
{
  "eventId": "507f1f77bcf86cd799439011",
  "ticketType": "VIP",
  "ticketQuantity": 2,
  "mpesaTransactionId": "ABC123XYZ"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "507f1f77bcf86cd799439012",
    "bookingId": "BK5F7E8D9C",
    "userId": "507f1f77bcf86cd799439013",
    "eventId": "507f1f77bcf86cd799439011",
    "ticketType": "VIP",
    "ticketQuantity": 2,
    "totalPrice": 6998,
    "bookingStatus": "pending",
    "paymentStatus": "pending",
    "mpesaTransactionId": "ABC123XYZ",
    "bookingDate": "2026-06-16T10:00:00.000Z",
    "createdAt": "2026-06-16T10:00:00.000Z",
    "updatedAt": "2026-06-16T10:00:00.000Z"
  }
}
```

### Get My Bookings
```
GET /bookings/my-bookings
Authorization: Bearer USER_TOKEN
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "bookings": [ ... ]
}
```

### Get Booking by ID
```
GET /bookings/:id
Authorization: Bearer USER_TOKEN
```

### Cancel Booking
```
PUT /bookings/:id/cancel
Authorization: Bearer USER_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": { ... }
}
```

### Get All Bookings (Admin Only)
```
GET /bookings
Authorization: Bearer ADMIN_TOKEN
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Invalid input or missing required fields"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "User role is not authorized"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limiting

Currently no rate limiting. Recommended for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

---

## Pagination (Future)

API ready for pagination:
```
GET /events?page=1&limit=10
```

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+254700000000",
    "password": "Test123",
    "passwordConfirm": "Test123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'

# Get Events
curl http://localhost:5000/api/events

# Create Booking (replace TOKEN and EVENT_ID)
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "eventId": "EVENT_ID",
    "ticketType": "VIP",
    "ticketQuantity": 1,
    "mpesaTransactionId": "TEST123"
  }'
```

---

**API Version:** 1.0.0
**Last Updated:** June 2026
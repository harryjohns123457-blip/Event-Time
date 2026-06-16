# Setup & Installation Guide

## System Requirements

- **Node.js:** v14 or higher
- **MongoDB:** v4.4 or higher (local or cloud)
- **npm:** v6 or higher
- **Modern Browser:** Chrome, Firefox, Safari, Edge

## Step-by-Step Installation

### 1. Clone Repository
```bash
git clone https://github.com/mosoticharles2-dot/Event-time.git
cd Event-time
```

### 2. Backend Setup

#### Install Dependencies
```bash
npm install
```

This installs:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - Cross-origin requests
- **nodemon** - Auto-reload development

#### Create Environment File
```bash
cp .env.example .env
```

Edit `.env`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/event-next-door

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Optional: Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

#### Setup MongoDB

**Local MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Windows (if installed)
mongod

# Linux
sudo systemctl start mongod
```

**MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

#### Seed Database
```bash
npm run seed
```

Creates:
- Admin user: `admin@eventdoor.com` / `Admin@123`
- 7 sample events

#### Start Backend Server
```bash
# Development
npm run dev

# Production
npm start
```

✅ Server running at: `http://localhost:5000`

### 3. Frontend Setup

#### Option A: Simple HTTP Server
```bash
cd frontend
python -m http.server 3000
# or
npx http-server -p 3000
```

#### Option B: Node HTTP Server
```bash
npm install -g http-server
http-server frontend -p 3000
```

#### Option C: Direct Browser
```bash
# Simply open:
frontend/index.html
```

✅ Frontend running at: `http://localhost:3000`

## Verification Checklist

- [ ] MongoDB running and connected
- [ ] Backend server on port 5000
- [ ] Frontend accessible on port 3000
- [ ] Admin user created (`admin@eventdoor.com`)
- [ ] Sample events seeded

## Testing the Application

### 1. Test Registration
```
1. Visit: http://localhost:3000/frontend/register.html
2. Fill form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: +254741234567
   - Password: TestPass123
3. Submit
4. Should redirect to events page
```

### 2. Test Login
```
1. Visit: http://localhost:3000/frontend/login.html
2. Enter: admin@eventdoor.com / Admin@123
3. Should see events page with greeting
```

### 3. Test Event Browsing
```
1. Visit: http://localhost:3000/frontend/event_list.html
2. Should load 7 events grouped by category
3. Click on event to view details
```

### 4. Test Booking
```
1. Login first
2. Click on any event
3. Select ticket type and quantity
4. Enter M-PESA Transaction ID: TEST123
5. Click "Confirm Booking"
6. Should redirect to bookings page
```

### 5. Test API with cURL
```bash
# Get all events
curl http://localhost:5000/api/events

# Get event by ID (replace with actual ID)
curl http://localhost:5000/api/events/[EVENT_ID]

# Test health
curl http://localhost:5000/api/health
```

## npm Scripts

```json
{
  "start": "node backend/server.js",
  "dev": "nodemon backend/server.js",
  "seed": "node backend/scripts/seed.js"
}
```

Run:
```bash
npm start    # Production
npm run dev  # Development with auto-reload
npm run seed # Seed database
```

## Directory Navigation

```bash
# From project root:

# Go to frontend
cd frontend
ls -la    # View files

# Go to backend
cd backend
ls -la    # View structure

# View configs
cat .env
cat package.json
```

## Common Issues & Solutions

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
```bash
# Start MongoDB
mongod  # or brew services start mongodb-community

# Verify connection
mongo
```

### Issue: Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Change PORT in .env
PORT=5001

# Or kill process
lsof -i :5000
kill -9 [PID]
```

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check FRONTEND_URL in .env
- Ensure backend CORS is enabled
- Restart backend server

### Issue: JWT Token Error
```
Error: Invalid token or Token expired
```
**Solution:**
```bash
# Clear browser localStorage
localStorage.clear()

# Login again
```

### Issue: Events Not Loading
```
"Failed to load events"
```
**Solution:**
```bash
# Reseed database
npm run seed

# Check backend logs
# Look for MongoDB connection issues
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|----------|
| MONGODB_URI | Database connection | `mongodb://localhost:27017/db` |
| PORT | Server port | `5000` |
| NODE_ENV | Environment type | `development` or `production` |
| JWT_SECRET | Token encryption key | `super_secret_key` |
| JWT_EXPIRE | Token validity | `7d` |
| FRONTEND_URL | CORS allowed origin | `http://localhost:3000` |

## Database Management

### View Collections
```bash
mongo
use event-next-door
db.users.find()
db.events.find()
db.bookings.find()
```

### Reset Database
```bash
mongo
use event-next-door
db.dropDatabase()
exit

npm run seed
```

### Export Data
```bash
mongodump --db event-next-door --out ./backup
```

## API Testing Tools

### Postman
1. Download: https://www.postman.com/downloads/
2. Import API collection
3. Test endpoints

### cURL
```bash
# Example requests in API section
```

### Insomnia
1. Download: https://insomnia.rest/
2. Create requests
3. Test API

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=very_long_random_secret_key
FRONTEND_URL=https://yourdomain.com
```

### Deploy Backend
```bash
# Using Heroku
heroku create your-app-name
git push heroku main

# Using Railway
railway up

# Using Render
# Connect GitHub repo in dashboard
```

### Deploy Frontend
```bash
# Using Vercel
vercel

# Using Netlify
netlify deploy --prod --dir frontend
```

## Useful Links

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Support

For issues or questions:
1. Check troubleshooting section
2. Review backend logs
3. Check browser console
4. Contact: 0790179791

---

**Ready to use! 🚀**
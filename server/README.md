# Lost and Found Backend API

A comprehensive backend API for the Lost and Found application built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Item Management**: CRUD operations for lost and found items
- **Search & Filtering**: Advanced search and filtering capabilities
- **Security**: Rate limiting, CORS, helmet security headers
- **Validation**: Request validation using express-validator
- **Error Handling**: Comprehensive error handling middleware

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── itemController.js   # Item management logic
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT authentication
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── LostItem.js        # Lost item schema
│   │   └── FoundItem.js       # Found item schema
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── itemRoutes.js      # Item management routes
│   └── app.js                 # Express app configuration
├── .env                       # Environment variables
├── package.json               # Dependencies
├── server.js                  # Server entry point
└── README.md                  # This file
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy the `.env` file and update the values:
   ```env
   MONGO_URI=mongodb://localhost:27017/lost-and-found
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system.

4. **Run the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `PUT /change-password` - Change password (Protected)
- `POST /logout` - Logout user (Protected)

### Items (`/api/items`)

- `GET /lost` - Get all lost items (with pagination & filtering)
- `GET /found` - Get all found items (with pagination & filtering)
- `GET /lost/:id` - Get single lost item
- `GET /found/:id` - Get single found item
- `POST /lost` - Create lost item (Protected)
- `POST /found` - Create found item (Protected)
- `PUT /lost/:id` - Update lost item (Protected)
- `PUT /found/:id` - Update found item (Protected)
- `DELETE /lost/:id` - Delete lost item (Protected)
- `DELETE /found/:id` - Delete found item (Protected)
- `GET /my/lost` - Get user's lost items (Protected)
- `GET /my/found` - Get user's found items (Protected)
- `GET /search` - Search items
- `GET /stats` - Get statistics

## Data Models

### User
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `full_name` (String, required)
- `phone` (String, optional)
- `avatar_url` (String, optional)
- `is_active` (Boolean, default: true)
- `last_login` (Date, optional)

### LostItem
- `user_id` (ObjectId, ref: User)
- `title` (String, required)
- `description` (String, required)
- `category` (Enum: Electronics, Books, ID Cards, Clothing, Others)
- `lost_date` (Date, required)
- `location` (String, required)
- `contact_info` (String, required)
- `image_url` (String, optional)
- `status` (Enum: lost, found, closed)
- `is_active` (Boolean, default: true)

### FoundItem
- `user_id` (ObjectId, ref: User)
- `title` (String, required)
- `description` (String, required)
- `category` (Enum: Electronics, Books, ID Cards, Clothing, Others)
- `found_date` (Date, required)
- `location` (String, required)
- `contact_info` (String, required)
- `image_url` (String, optional)
- `status` (Enum: available, returned, closed)
- `is_active` (Boolean, default: true)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevents abuse with request rate limiting
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for protection
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses

## Development

The server runs on `http://localhost:5000` by default. The API is designed to work with the frontend application running on `http://localhost:5173`.

### Environment Variables

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: JWT token expiration time
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `CLIENT_URL`: Frontend URL for CORS

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a secure JWT secret
3. Configure MongoDB Atlas or production MongoDB
4. Set up proper CORS origins
5. Use environment variables for all configuration

## API Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

Error responses include additional error details in development mode.


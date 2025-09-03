# Madhutube Backend

Madhutube is a scalable Node.js backend for a modern video-sharing platform, inspired by YouTube. It provides robust APIs for user authentication, video uploads, comments, likes, playlists, subscriptions, and more. Built with Express and MongoDB, the project is modular and production-ready, supporting JWT authentication, file uploads to Cloudinary, and a clean, maintainable codebase structure.

## Project Structure

```
├── package.json
├── .env
├── public/
│   └── temp/                # Temporary uploads for Multer
└── src/
    ├── app.js               # Express app setup, middleware, and route registration
    ├── index.js             # Entry point, loads env and connects DB
    ├── config/
    │   └── db.js            # MongoDB connection logic
    ├── controllers/         # Business logic for each resource
    │   ├── commentController.js
    │   ├── healthcheckController.js
    │   ├── likeController.js
    │   ├── playlistController.js
    │   ├── subscriptionController.js
    │   ├── tweetController.js
    │   ├── userController.js
    │   └── videoController.js
    ├── middlewares/         # Custom Express middlewares
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   └── multerMiddleware.js
    ├── models/              # Mongoose schemas
    │   ├── commentModel.js
    │   ├── likeModel.js
    │   ├── playlistModel.js
    │   ├── subscriptionModel.js
    │   ├── tweetModel.js
    │   ├── userModel.js
    │   └── videoModel.js
    ├── routes/              # Express routers for all resources
    │   ├── commentRoute.js
    │   ├── healthcheckRoute.js
    │   ├── likeRoute.js
    │   ├── playlistRoute.js
    │   ├── subscriptionRoute.js
    │   ├── tweetRoute.js
    │   ├── userRoute.js
    │   └── videoRoute.js
    └── utils/               # Utility modules
        ├── apiError.js
        ├── apiResponse.js
        ├── asyncHandler.js
        └── cloudinary.js
```

## Key Features

- User authentication (JWT, refresh tokens)
- Video CRUD and uploads (Cloudinary)
- Comments, likes, playlists, subscriptions, tweets
- User profile management (avatar, cover image)
- Watch history
- Robust error handling

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables** in `.env` (see sample below)
3. **Start the server**
   ```bash
   npm run dev
   ```

## Example `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=1d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

## Main API Endpoints

- `/api/v1/users` User registration, login, profile, etc.
- `/api/v1/videos` Video CRUD
- `/api/v1/comments` Comment CRUD
- `/api/v1/likes` Like/unlike
- `/api/v1/playlists` Playlist management
- `/api/v1/subscriptions` Subscribe/unsubscribe
- `/api/v1/tweets` Tweet-like posts
- `/api/v1/healthcheck` Health check

## Tech Stack

- Node.js, Express, MongoDB, Mongoose
- JWT, Cloudinary, Multer

---

© 2025 Madhutube Backend

## Setup

1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` or use the following as `.env`:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_uri
     CORS_ORIGIN=*
     ACCESS_TOKEN_SECRET=your_access_secret
     ACCESS_TOKEN_EXPIRY=1d
     REFRESH_TOKEN_SECRET=your_refresh_secret
     REFRESH_TOKEN_EXPIRY=1d
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     NODE_ENV=development
     ```
4. **Start the server**
   ```bash
   npm start
   ```

## API Endpoints

- `POST   /api/v1/users/register` Register a new user
- `POST   /api/v1/users/login` Login and receive tokens
- `POST   /api/v1/users/refresh-token` Refresh access token
- `POST   /api/v1/users/logout` Logout user
- `PATCH  /api/v1/users/update-account` Update user details
- `PATCH  /api/v1/users/avatar` Update avatar
- `PATCH  /api/v1/users/cover-image` Update cover image
- `GET    /api/v1/users/current-user` Get current user info
- `GET    /api/v1/users/c/:username` Get channel profile
- `GET    /api/v1/users/history` Get watch history

- `CRUD   /api/v1/videos` Video management
- `CRUD   /api/v1/comments` Comment management
- `CRUD   /api/v1/likes` Like/unlike videos
- `CRUD   /api/v1/playlists` Playlist management
- `CRUD   /api/v1/subscriptions` Subscribe/unsubscribe
- `CRUD   /api/v1/tweets` Tweet-like posts

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT for authentication
- Cloudinary for media
- Multer for file uploads

## Notes

- All endpoints return a consistent JSON response structure.
- Use Postman or similar tools for API testing. Send JSON bodies for all POST/PATCH requests.
- Make sure your `.env` is configured with valid secrets and API keys.

---

© 2025 Madhutube Backend

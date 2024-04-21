const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');

// Route imports (assuming separate files for each route)
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');


// Define __dirname once
const __dirnames = path.resolve(); // Adjust __dirname to point to the root folder

// Database connection (assuming connection details are in .env)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB is connected successfully!!');
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit process on connection error
  }
};

// Middlewares
dotenv.config();
const app = express();
app.use(express.json());
app.use('/images', express.static(path.join(__dirnames,'/backend/images')));
app.use(cookieParser());

// Mount route handlers
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);

app.use(express.static(path.join(__dirnames, "/frontend/dist")));
// Serve frontend files (assuming a single-page application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnames, 'frontend', 'dist', 'index.html'));
});

// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    // Consider using a unique filename generation strategy
    cb(null, req.body.img || Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(200).json('Image has been uploaded successfully!!');
});

// Server start
const PORT = process.env.PORT || 5000; // Use environment variable or default

app.listen(PORT, () => {
  connectDB();
  console.log(`App is running on port ${PORT}`);
});

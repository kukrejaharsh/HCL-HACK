require('dotenv').config(); // Loads .env file contents
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db'); // Import DB connection
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Import error handlers

dotenv.config({
    path : './env'
});


// Import routes
const testRoutes = require('./routes/testRoutes');

// --- Database Connection ---

connectToDatabase()
.then(()=>{
    app.listen(process.env.PORT || 3000, () => {
        console.log(` Server is running on port ${process.env.PORT || 3000}`);
    })
})
.catch((error) => {
    console.error("Failed to connect to MongoDB", error);
});


const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Set security headers

// Use morgan for logging in dev environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// === API ROUTES ===
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the backend API!' });
});

// Mount routes
app.use('/api/test', testRoutes);

// === ERROR HANDLING MIDDLEWARE ===
// These must be defined *after* your routes
app.use(notFound); // Handles 404 (Not Found) errors
app.use(errorHandler); // Handles all other errors

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});
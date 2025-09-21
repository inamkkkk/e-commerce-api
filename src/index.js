const express = require('express');
const createHttpError = require('http-errors');
const { config, connectDB } = require('./config');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json()); // Body parser for JSON

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ message: 'API is healthy!', uptime: process.uptime() });
});

// Handle undefined routes
app.use((req, res, next) => {
  next(createHttpError(404, 'Route not found.'));
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
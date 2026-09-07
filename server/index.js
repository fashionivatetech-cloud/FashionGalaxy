require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const profileRoutes = require('./routes/profiles');
const connectionRoutes = require('./routes/connections');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profiles', profileRoutes);
app.use('/api/connections', connectionRoutes);

// Health check
app.get('/', (req, res) => res.send('FashionGalaxy API is running ✨'));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

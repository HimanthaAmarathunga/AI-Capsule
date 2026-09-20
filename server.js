require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const capsuleRoutes = require('./routes/capsules');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);

// Serve React frontend (production build)
const clientBuild = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientBuild));

// Catch-all: serve React app for any non-API route (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AI Capsule server running on port ${PORT}`);
});

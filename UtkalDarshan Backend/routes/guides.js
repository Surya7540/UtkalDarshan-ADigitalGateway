const express = require('express');
const router = express.Router();

// Placeholder for guide management routes
// This can be expanded later for guide registration and management

router.get('/health', (req, res) => {
  res.json({ message: 'Guide routes are working' });
});

module.exports = router;

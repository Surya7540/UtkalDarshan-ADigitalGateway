const express = require('express');
const router = express.Router();

// Placeholder for driver management routes
// This can be expanded later for driver registration and management

router.get('/health', (req, res) => {
  res.json({ message: 'Driver routes are working' });
});

module.exports = router;

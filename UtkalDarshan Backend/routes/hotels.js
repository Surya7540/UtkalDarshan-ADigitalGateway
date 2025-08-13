const express = require('express');
const router = express.Router();

// Placeholder for hotel management routes
// This can be expanded later for hotel registration and management

router.get('/health', (req, res) => {
  res.json({ message: 'Hotel routes are working' });
});

module.exports = router;

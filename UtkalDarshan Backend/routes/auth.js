const express = require('express');
const router = express.Router();

// This file is for future user authentication features
// Currently, only admin authentication is implemented in admin.js

router.get('/health', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

module.exports = router;

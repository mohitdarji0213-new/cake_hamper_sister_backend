const express = require('express');
const router = express.Router();
const { submitContact, getContacts, markRead, resolveContact } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Custom cake order mein customer apni reference photo bhej sakta hai (optional)
router.post('/', upload.single('image'), submitContact);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markRead);
router.put('/:id/resolve', protect, adminOnly, resolveContact);

module.exports = router;

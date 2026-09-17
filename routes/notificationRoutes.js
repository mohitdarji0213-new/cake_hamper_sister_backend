const express = require('express');
const router = express.Router();
const {
  getSummary, markOrderSeen, markAllOrdersSeen, getNotificationPref, setNotificationPref,
} = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/summary', protect, adminOnly, getSummary);
router.put('/orders/:id/seen', protect, adminOnly, markOrderSeen);
router.put('/orders/seen-all', protect, adminOnly, markAllOrdersSeen);
router.get('/preference', protect, adminOnly, getNotificationPref);
router.put('/preference', protect, adminOnly, setNotificationPref);

module.exports = router;

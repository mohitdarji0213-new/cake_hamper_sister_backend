const express = require('express');
const router = express.Router();
const { getOffers, getAllOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getOffers);
router.get('/all', protect, adminOnly, getAllOffers);
router.post('/', protect, adminOnly, upload.single('image'), createOffer);
router.put('/:id', protect, adminOnly, upload.single('image'), updateOffer);
router.delete('/:id', protect, adminOnly, deleteOffer);

module.exports = router;

const mongoose = require('mongoose');

// Special occasion offers - Diwali, Holi, Birthday, New Year etc. par cakes pe chhut
const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  occasion: {
    type: String,
    enum: ['diwali', 'holi', 'birthday', 'new_year', 'christmas', 'valentine', 'other'],
    default: 'other',
  },
  discountPercent: { type: Number, required: true, min: 1, max: 90 },
  code: String, // optional coupon code, e.g. DIWALI20
  image: String,
  validFrom: Date,
  validTill: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);

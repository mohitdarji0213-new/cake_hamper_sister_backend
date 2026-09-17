const Offer = require('../models/Offer');

// Public - sirf active offers (jo expire nahi hue)
exports.getOffers = async (req, res) => {
  const now = new Date();
  const offers = await Offer.find({
    isActive: true,
    $or: [{ validTill: { $exists: false } }, { validTill: null }, { validTill: { $gte: now } }],
  }).sort('-createdAt');
  res.json(offers);
};

// Admin - sabhi offers (active + inactive)
exports.getAllOffers = async (req, res) => {
  const offers = await Offer.find().sort('-createdAt');
  res.json(offers);
};

exports.createOffer = async (req, res) => {
  const { title, description, occasion, discountPercent, code, validFrom, validTill } = req.body;
  const image = req.file ? req.file.path : '';
  const offer = await Offer.create({ title, description, occasion, discountPercent, code, image, validFrom, validTill });
  res.status(201).json(offer);
};

exports.updateOffer = async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  if (req.file) req.body.image = req.file.path;
  Object.assign(offer, req.body);
  await offer.save();
  res.json(offer);
};

exports.deleteOffer = async (req, res) => {
  await Offer.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Offer deleted' });
};

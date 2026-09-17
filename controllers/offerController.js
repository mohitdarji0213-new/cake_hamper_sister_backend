const Offer = require('../models/Offer');

// Public - sirf active offers jo abhi chal rahe hain (start ho chuke + expire nahi hue)
exports.getOffers = async (req, res) => {
  const now = new Date();
  const offers = await Offer.find({
    isActive: true,
    $and: [
      // Start date (validFrom) abhi tak aa chuki honi chahiye
      { $or: [{ validFrom: { $exists: false } }, { validFrom: null }, { validFrom: { $lte: now } }] },
      // Last date (validTill) abhi tak expire nahi honi chahiye
      { $or: [{ validTill: { $exists: false } }, { validTill: null }, { validTill: { $gte: now } }] },
    ],
  }).sort('-createdAt');
  res.json(offers);
};

// Admin - sabhi offers (active + inactive + future + expired)
exports.getAllOffers = async (req, res) => {
  const offers = await Offer.find().sort('-createdAt');
  res.json(offers);
};

// Khali date strings ko null kar do taaki mongoose cast error na de
const cleanDate = (v) => (v === '' || v === undefined) ? null : v;

exports.createOffer = async (req, res) => {
  const { title, description, occasion, discountPercent, code } = req.body;
  const image = req.file ? req.file.path : '';
  const offer = await Offer.create({
    title,
    description,
    occasion,
    discountPercent,
    code,
    image,
    validFrom: cleanDate(req.body.validFrom),
    validTill: cleanDate(req.body.validTill),
  });
  res.status(201).json(offer);
};

exports.updateOffer = async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  if (req.file) req.body.image = req.file.path;
  ['validFrom', 'validTill'].forEach((k) => {
    if (req.body[k] === '') req.body[k] = null;
  });
  Object.assign(offer, req.body);
  await offer.save();
  res.json(offer);
};

exports.deleteOffer = async (req, res) => {
  await Offer.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Offer deleted' });
};

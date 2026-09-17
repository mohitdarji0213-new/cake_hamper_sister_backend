const Order = require('../models/Order');
const Contact = require('../models/Contact');
const User = require('../models/User');

// Admin bell ke liye - naye orders + naye custom cake requests ka summary
// Frontend ye endpoint ko har 20-25 second mein poll karta hai
exports.getSummary = async (req, res) => {
  const [unseenOrders, unreadCustomOrders, unreadIssues, latestOrder] = await Promise.all([
    Order.countDocuments({ isSeenByAdmin: false }),
    Contact.countDocuments({ type: 'order_inquiry', isRead: false }),
    Contact.countDocuments({ type: 'issue', isRead: false }),
    Order.findOne().sort('-createdAt').select('orderNumber customer.name totalAmount createdAt'),
  ]);
  res.json({
    unseenOrders,
    unreadCustomOrders,
    unreadIssues,
    total: unseenOrders + unreadCustomOrders + unreadIssues,
    latestOrder,
  });
};

// Ek order ko "seen" mark karo (jab admin usko kholta/dekhta hai)
exports.markOrderSeen = async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { isSeenByAdmin: true });
  res.json({ message: 'Order marked as seen' });
};

// Sabhi orders ko ek saath seen mark karo (bell dropdown "clear all")
exports.markAllOrdersSeen = async (req, res) => {
  await Order.updateMany({ isSeenByAdmin: false }, { isSeenByAdmin: true });
  res.json({ message: 'All orders marked as seen' });
};

// Admin login ke baad har baar check hota hai ki browser notifications enable hai ya nahi
exports.getNotificationPref = async (req, res) => {
  res.json({ notificationsEnabled: !!req.user.notificationsEnabled });
};

exports.setNotificationPref = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { notificationsEnabled: !!req.body.notificationsEnabled },
    { new: true }
  );
  res.json({ notificationsEnabled: user.notificationsEnabled });
};

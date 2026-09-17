const Contact = require('../models/Contact');
const sendEmail = require('../config/email');

exports.submitContact = async (req, res) => {
  const { name, email, phone, type, subject, message } = req.body;
  const image = req.file ? req.file.path : undefined;
  const contact = await Contact.create({ name, email, phone, type, subject, message, image });

  const isCustomCakeOrder = type === 'order_inquiry';
  const photoLine = image ? `<p><strong>Reference Photo:</strong> <a href="${image}">${image}</a></p><img src="${image}" style="max-width:280px;border-radius:12px;margin-top:8px" />` : '';

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New ${isCustomCakeOrder ? 'Custom Cake Order' : 'Issue'} from ${name} | Cake Hamper Sisters`,
    html: `<h3>${isCustomCakeOrder ? '🎂 Custom Cake Order Request' : 'Support Issue'}</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong> ${message}</p>${photoLine}`
  });

  await sendEmail({
    to: email,
    subject: `Aapka message mil gaya - Cake Hamper Sisters`,
    html: `<h2>Namaste ${name}!</h2><p>Aapka message humein mil gaya hai. Hum jald hi aapse contact karenge.</p><p>- Garima Bothra<br>Cake Hamper Sisters</p>`
  });

  res.status(201).json({ message: 'Message sent successfully', id: contact._id });
};

exports.getContacts = async (req, res) => {
  const { type, isRead } = req.query;
  const query = {};
  if (type) query.type = type;
  if (isRead !== undefined) query.isRead = isRead === 'true';
  const contacts = await Contact.find(query).sort('-createdAt');
  res.json(contacts);
};

exports.markRead = async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Marked as read' });
};

exports.resolveContact = async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { isResolved: true });
  res.json({ message: 'Resolved' });
};

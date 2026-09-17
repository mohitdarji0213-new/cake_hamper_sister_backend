const Category = require('../models/Category');
const slugify = require('slugify');

// type query se filter (flavor / design) - homepage par 2 alag sections dikhane ke liye
exports.getCategories = async (req, res) => {
  const { type } = req.query;
  const query = { isActive: true };
  if (type) query.type = type;
  const categories = await Category.find(query).sort({ order: 1, createdAt: 1 });
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const { name, description, icon, type, order } = req.body;
  const slug = slugify(name, { lower: true });
  const image = req.file ? req.file.path : '';
  const category = await Category.create({ name, slug, description, icon, image, type, order });
  res.status(201).json(category);
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
  if (req.file) req.body.image = req.file.path;
  Object.assign(category, req.body);
  await category.save();
  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Category deleted' });
};

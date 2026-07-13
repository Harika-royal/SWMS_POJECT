const Product = require('../models/Product');
const InventoryItem = require('../models/InventoryItem');
const { notifyLowStock } = require('../services/notificationService');

const buildQuery = ({ search, category, status }) => {
  const q = {};
  if (category) q.category = category;
  if (search) {
    q.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }
  return q;
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    const query = buildQuery(req.query);
    const skip = (Number(page) - 1) * Number(limit);
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    const enriched = await Promise.all(
      products.map(async (p) => {
        const inv = await InventoryItem.findOne({ productId: p._id });
        const stock = inv?.quantity ?? 0;
        let status = 'in-stock';
        if (stock === 0) status = 'out-of-stock';
        else if (stock <= (p.minStock || 10)) status = 'low-stock';
        return { ...p.toObject(), stock, status };
      })
    );

    res.json({ success: true, products: enriched, total, pages: Math.ceil(total / Number(limit)), page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const inv = await InventoryItem.findOne({ productId: product._id });
    res.json({ success: true, product: { ...product.toObject(), stock: inv?.quantity ?? 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const exists = await Product.findOne({ sku: req.body.sku });
    if (exists) return res.status(400).json({ success: false, message: 'A product with this SKU already exists' });
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'SKU must be unique' });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const inv = await InventoryItem.findOne({ productId: product._id });
    if (inv && inv.quantity <= (product.minStock || 10)) await notifyLowStock(product.name, inv.quantity);
    res.json({ success: true, product });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'SKU must be unique' });
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await InventoryItem.deleteMany({ productId: req.params.id });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategories = async (_req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

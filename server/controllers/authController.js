const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password} = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });


user = new User({
  name,
  email,
  password,
  role: "employee",
});
console.log("Saving user:", user);
await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { _id: user.id, name, email, role: user.role } });
    });
  } catch (err) {
  console.error("REGISTER ERROR:", err);

  return res.status(500).json({
    success: false,
    message: err.message,
  });
}
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { _id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
  console.error("REGISTER ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message,
    error: err,
  });
}
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

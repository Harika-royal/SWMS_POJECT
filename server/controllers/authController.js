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
try {
  await user.save();
} catch (e) {
  console.error("SAVE ERROR:", e);
  return res.status(500).json({
    success: false,
    message: e.message,
    error: e,
  });
}
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

  // Demo login (No MongoDB required)
  if (
    email === "admin@swms.com" &&
    password === "Admin@123"
  ) {
    const demoUser = {
      _id: "demo-admin",
      name: "SWMS Administrator",
      email: "admin@swms.com",
      role: "admin",
    };

    const payload = {
      user: {
        id: demoUser._id,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      success: true,
      token,
      user: demoUser,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid Email or Password",
  });
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

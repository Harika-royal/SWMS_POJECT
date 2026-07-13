const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { user: { id: userId } },
    process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;

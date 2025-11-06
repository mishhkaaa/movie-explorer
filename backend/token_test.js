require('dotenv').config();
const jwt = require('jsonwebtoken');

const token1 = jwt.sign(
  { userId: "123", time: Date.now() },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const token2 = jwt.sign(
  { userId: "123", time: Date.now() },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

console.log("Token 1:", token1);
console.log("Token 2:", token2);

const bcrypt = require("bcrypt");

const hashPassword = (raw) => {
  const saltRounds = 10;
  return bcrypt.hash(raw, saltRounds);
};

const verifyPassword = (raw, hashed) => {
  return bcrypt.compare(raw, hashed);
};

module.exports = { verifyPassword, hashPassword };

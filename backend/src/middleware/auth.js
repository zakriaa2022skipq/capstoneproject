const auth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    req.statusCode = 401;
    next({ message: "User unauthorized" });
  }
};

module.exports = auth;

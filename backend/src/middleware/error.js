const errorMiddleware = (error, req, res, next) => {
  const statusCode = req.statusCode || 500;
  console.log(error);
  const msg = error.message || "Something went wrong try again later!";
  return res.status(statusCode).json({ msg });
};

module.exports = { errorMiddleware };

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    message: "Access denied. Please log in.",
  });
};

export { isAuthenticated };

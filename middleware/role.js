module.exports = (roles) => (req, res, next) => {
  console.log('User Role:', req.user.role); // Verifica que el rol se está pasando correctamente
  if (!roles.includes(req.user.role)) {
    return res.status(403).send('Access denied.');
  }
  next();
};

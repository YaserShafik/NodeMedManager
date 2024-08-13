const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Verificar el contenido del token
    req.user = decoded;  // Aquí es donde se adjunta el rol y el ID del usuario
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

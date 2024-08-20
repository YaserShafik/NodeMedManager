module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Manejo de errores CSRF
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'Form tampered with or session expired. Please try again.'
    });
  }

  // Manejo general de otros errores
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

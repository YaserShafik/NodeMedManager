const {check, validationResult} = require('express-validator')
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware de validación y sanitización
exports.validateRegister = [
  check('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .escape(),
  check('email')
    .isEmail().withMessage('Please include a valid email')
    .normalizeEmail(), // Sanitiza el correo
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be 6 or more characters')
    .escape(),
  check('role')
    .optional()
    .isIn(['Patient', 'Doctor', 'Admin']).withMessage('Invalid role')
    .escape()
];

// Función `register` con validación, similar a la original
exports.register = async (req, res) => {
  // Validar los datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password, role } = req.body;
    // Crear un nuevo usuario
    user = new User({ username, email, password: await bcrypt.hash(password, 10), role });

    // Guardar el usuario en la base de datos
    await user.save();

    // Generar un token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log('Generated JWT:', jwt.verify(token, process.env.JWT_SECRET)); // Verificar el token generado

    // Enviar el token en una cookie segura
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000
    });

    if (user.role === 'Doctor'){
      return res.status(201).redirect('/api/appointments/create')
    } else{
      return res.status(200).send('User registered sucessfully')
    }
        

  } catch (error) {
    res.status(500).send('Server error');
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt with email: ", email);
    

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email: ", email);
      return res.status(400).send('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match for email:", email);  // Contraseña no coincide
      return res.status(400).send('Invalid email or password');
    }

    // Incluir el rol en el token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 3600000 // 1 hour
    });
    console.log("User logged in successfully: ", user.username);
    
    if (user.role === 'Doctor'){
      return res.status(201).redirect('/api/appointments/create')
    } else{
      return res.status(200).send('User registered sucessfully')
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
};


exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Server error');
    res.clearCookie('token');
    res.redirect('/api/auth/login');
  });
};

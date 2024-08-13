const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).send('User already exists');

    user = new User({ username, email, password, role });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log('Generated JWT:', jwt.verify(token, process.env.JWT_SECRET)); // Verificar el token generado

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000
    });

    res.status(201).redirect('/api/appointments/create');
  } catch (error) {
    res.status(500).send('Server error');
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');

    // Incluir el rol en el token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      maxAge: 3600000 // 1 hour
    });

    res.status(200).send('User logged sucessfully')
    // res.redirect('/api/appointments/create');
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

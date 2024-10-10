const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const cors = require('cors');
const csurf = require('csurf');
const helmetConfig = require('./config/helmetConfig');
const path = require('path');
const auth = require('./middleware/auth');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// View engine ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmetConfig);
app.use(cors());
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static('public'));


// Load 'method-override' to handel  PUT and DELETE through POST, DONT TOUCH
app.use(methodOverride((req, res) => {
  console.log(`Interceptando método: ${req.method}, _method: ${req.body._method}`);
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      return req.body._method;
  }
  return req.method;
}));

// Protección CSRF
const csrfProtection = csurf({
    cookie: true
  })
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); 
    next();
});

// Routes
app.get('/', (req, res) => {
  res.render('login', {
    title: 'Login',
    csrfToken: req.csrfToken()  
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use(auth);  // Middleware de autenticación
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));


// errorHandler middleware
app.use(require('./middleware/errorHandler'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  // Init server only after successful MongoDB connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('Error al conectar a MongoDB:', err);
  process.exit(1); 
});


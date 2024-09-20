const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const csurf = require('csurf');
const helmetConfig = require('./config/helmetConfig')
const path = require('path');
const auth = require('./middleware/auth');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(helmetConfig);
app.use(methodOverride('_method'));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const csrfProtection = csurf({cookie: true});
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Esto hace que csrfToken esté disponible en todas las vistas
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use(auth)
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// app.use((req, res, next) => {
//   const error = new Error('Not Found');
//   error.statusCode = 404;
//   next(error);
// });
app.use(require('./middleware/errorHandler'));

// Server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

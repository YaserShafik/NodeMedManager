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

// Configuración de motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware de seguridad
app.use(helmetConfig);
app.use(cors());
app.use(cookieParser());

// Middlewares para manejar JSON, URL-encoded y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log('Cuerpo de la solicitud (req.body):', req.body);
    next();
  });

// Middleware para archivos estáticos
app.use(express.static('public'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);  // Finaliza la aplicación si no puede conectarse a la base de datos
});

// Cargar `method-override` para manejar PUT y DELETE a través de POST
app.use(methodOverride((req, res) => {
    console.log(`Interceptando método: ${req.method}, _method: ${req.body._method}`);
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      return req.body._method;  // Cambiar el método HTTP a lo que indica _method
    }
}));
// Log para verificar el método HTTP y la ruta
app.use((req, res, next) => {
    console.log(`Método: ${req.method}, Ruta: ${req.originalUrl}`);  // Log del método y ruta
    next();
});

// Protección CSRF
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // CSRF token disponible en todas las vistas
    next();
});

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use(auth);  // Middleware de autenticación
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// Middleware de manejo de errores
app.use(require('./middleware/errorHandler'));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

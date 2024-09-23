const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


router.get('/create', auth, role(['Doctor']), (req, res) => {
  res.render('createAppointment', { csrfToken: req.csrfToken() });
});

router.get('/update/:id', auth, role(['Doctor']), async (req, res) => {
  try {
    // Obtener la cita por ID
    const appointment = await appointmentController.getAppointmentById(req.params.id);
    
    // Verificar si la cita existe
    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    // Renderizar la vista de actualización, pasando la cita y el token CSRF
    res.render('updateAppointment', {
      appointment,  
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error('Error fetching appointment for update:', error);
    res.status(500).send('Server error');
  }
});

// Ruta para eliminar cita - GET para cargar la vista
router.get('/delete/:id', auth, role(['Doctor', 'Admin']), async (req, res) => {
  try {
    const appointment = await appointmentController.getAppointmentById(req.params.id);
    
    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    res.render('deleteAppointment', {
      appointment,
      csrfToken: req.csrfToken()  // Pasar el token CSRF a la vista
    });
  } catch (error) {
    console.error('Error fetching appointment for deletion:', error);
    res.status(500).send('Server error');
  }
});



router.put('/update/:id', auth, role(['Doctor']), appointmentController.updateAppointment);
// API routes
router.post('/', auth, role(['Doctor']), appointmentController.createAppointment);
router.get('/', auth, role(['Doctor', 'Admin']), appointmentController.getAppointments);
router.get('/:id', auth, role(['Doctor', 'Admin']), appointmentController.getAppointment);

router.delete('/delete/:id', auth, role(['Doctor']), appointmentController.deleteAppointment);

module.exports = router;

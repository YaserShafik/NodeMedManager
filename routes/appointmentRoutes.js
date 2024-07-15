const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

// Render views
router.get('/create', auth, (req, res) => {
  res.render('createAppointment');
});

router.get('/update/:id', auth, async (req, res) => {
  const appointment = await appointmentController.getAppointmentById(req.params.id);
  res.render('updateAppointment', { appointment });
});

router.get('/delete/:id', auth, async (req, res) => {
  const appointment = await appointmentController.getAppointmentById(req.params.id);
  res.render('deleteAppointment', { appointment });
});

// API routes
router.post('/', auth, appointmentController.createAppointment);
router.get('/', auth, appointmentController.getAppointments);
router.get('/:id', auth, appointmentController.getAppointment);
router.put('/:id', auth, appointmentController.updateAppointment);
router.delete('/:id', auth, appointmentController.deleteAppointment);

module.exports = router;

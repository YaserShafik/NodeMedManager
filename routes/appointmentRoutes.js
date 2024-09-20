const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');


router.get('/create', auth, role(['Doctor']), (req, res) => {
  res.render('createAppointment', { csrfToken: req.csrfToken() });
});

router.get('/update/:id', auth, role(['Doctor']), async (req, res) => {
  // const appointment = await appointmentController.renderUpdateAppointment;
  res.render('updateAppointment', { csrfToken: req.csrfToken() });
});

router.get('/delete/:id', auth, role(['Doctor', 'Admin']), async (req, res) => {
  const appointment = await appointmentController.getAppointmentById(req.params.id);
  res.render('deleteAppointment', { appointment });
});

// API routes
router.post('/', auth, role(['Doctor']), appointmentController.createAppointment);
router.get('/', auth, role(['Doctor', 'Admin']), appointmentController.getAppointments);
router.get('/:id', auth, role(['Doctor', 'Admin']), appointmentController.getAppointment);
router.put('/update/:id', auth, role(['Doctor']), appointmentController.updateAppointment);
router.delete('/:id', auth, role(['Admin']), appointmentController.deleteAppointment);

module.exports = router;

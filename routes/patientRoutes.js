const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Render views
router.get('/create', auth, role(['Admin', 'Doctor']), (req, res) => {
  res.render('createPatient');
});

router.get('/update/:id', auth, role(['Admin', 'Doctor']), async (req, res) => {
  const patient = await patientController.getPatientById(req.params.id);
  res.render('updatePatient', { patient });
});

router.get('/delete/:id', auth, role(['Admin']), async (req, res) => {
  const patient = await patientController.getPatientById(req.params.id);
  res.render('deletePatient', { patient });
});

// API routes
router.post('/', auth, role(['Admin', 'Doctor']), patientController.createPatient);
router.get('/', auth, role(['Admin', 'Doctor']), patientController.getPatients);
router.get('/:id', auth, role(['Admin', 'Doctor']), patientController.getPatient);
router.put('/:id', auth, role(['Admin', 'Doctor']), patientController.updatePatient);
router.delete('/:id', auth, role(['Admin']), patientController.deletePatient);

module.exports = router;

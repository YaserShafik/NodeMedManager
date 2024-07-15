const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');

// Render views
router.get('/create', (req, res) => {
  res.render('createPatient');
});

router.get('/update/:id', async (req, res) => {
  const patient = await patientController.getPatientById(req.params.id);
  res.render('updatePatient', { patient });
});

router.get('/delete/:id', async (req, res) => {
  const patient = await patientController.getPatientById(req.params.id);
  res.render('deletePatient', { patient });
});

router.post('/', auth, patientController.createPatient);
router.get('/', auth, patientController.getPatients);
router.get('/:id', auth, patientController.getPatient);
router.put('/:id', auth, patientController.updatePatient);
router.delete('/:id', auth, patientController.deletePatient);

module.exports = router;
